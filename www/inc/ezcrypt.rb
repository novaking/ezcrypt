#!/usr/bin/ruby

require 'openssl'
require 'base64'
require 'securerandom'

require 'net/http'
require 'net/https'

def pbkdf2(password, salt, keylen, opts = {})
	hash = opts[:hash] || 'sha1'
	iterations = (opts[:iterations] || 1) - 1
	def bigendian(val, len)
		len.times.map { val, r = val.divmod 256; r }.reverse.pack('C*')
	end
	key = ''
	blockindex = 1
	while key.length < keylen
		block = OpenSSL::HMAC.digest(hash, password, salt + bigendian(blockindex, 4))
		u = block
		iterations.times do
			u = OpenSSL::HMAC.digest(hash, password, u)
			block.length.times.each do |j|
				block[j] ^= u[j]
			end
		end
		key += block
		blockindex += 1
	end
	key.slice(0, keylen)
end

def aes_decrypt(text, key, opts = {})
	text = text.dup
	iv = text.slice!(0, 16) # aes has fixed blocksize of 128 bits
	key = pbkdf2(key, iv, (opts[:aeskeysize] || 256) / 8, opts)

	cipher = OpenSSL::Cipher::AES.new(8 * key.length, opts[:mode] || :OFB).decrypt
	cipher.key = key
	cipher.iv = iv
	cipher.update(text) + cipher.final
end

def aes_encrypt(text, opts = {})
	key = opts[:key] || generateKey(opts[:keylen] || 24)
	cipher = OpenSSL::Cipher::AES.new(opts[:aeskeysize] || 256, opts[:mode] || :OFB).encrypt
	cipher.iv = iv = opts[:iv] || cipher.random_iv
	cipher.key = pbkdf2(key, iv, (opts[:aeskeysize] || 256) / 8, opts)
	text = cipher.update(text) + cipher.final
	[ iv + text, key ]
end

def generateKey(len = 24)
	chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	len.times.map { chars[SecureRandom.random_number(chars.length)].ord }.pack('c*')
end

def decrypt(text, key, opts = {})
	text = Base64.decode64(text)
	aes_decrypt(text, key, opts)
end

def encrypt(text, opts = {})
	text, key = aes_encrypt(text, opts)
	[ Base64.encode64(text).gsub(/\s+/, ""), key ]
end

def fixipv6host(host)
	if m = /^\[([0-9a-fA-F:]+)\]$/.match(host)
		return m[1]
	end
	host
end

def http_get(uri)
	request = Net::HTTP::Get.new uri.request_uri
	request['Host'] = uri.host
	http = Net::HTTP.new(fixipv6host(uri.host), uri.port)
	http.use_ssl = uri.scheme == 'https'
# 	http.verify_mode = OpenSSL::SSL::VERIFY_PEER
# 	http.verify_depth = 5
	http.verify_mode = OpenSSL::SSL::VERIFY_NONE
	http.start { |http| http.request request }
end

def http_post(uri, args)
	request = Net::HTTP::Post.new(uri.request_uri)
	request['Host'] = uri.host
	request.set_form_data(args)
	http = Net::HTTP.new(fixipv6host(uri.host), uri.port)
	http.use_ssl = uri.scheme == 'https'
# 	http.verify_mode = OpenSSL::SSL::VERIFY_PEER
# 	http.verify_depth = 5
	http.verify_mode = OpenSSL::SSL::VERIFY_NONE
	http.start { |http| http.request request }
end

def hashpw(password)
	return nil if password.nil?
	return OpenSSL::Digest::SHA1.hexdigest(password)
end

require 'optparse'
opts = {}
OptionParser.new do |o|
	o.on('-u', '--url URL', "Retrieve paste from url (conflicts with the posting options)") { |url| opts[:url] = URI(url) }
	o.on('-f', '--file FILENAME', "Upload file") { |fn| opts[:fn] = fn }
	o.on('-m', '--mime MIMETYPE', "Specify mime type for paste") { |mime| opts[:mime] = mime }
	o.on('-t', '--ttl TTL', "Specify Time-To-Live for paste in seconds, default one week (-1 for indefinately)") { |ttl| opts[:ttl] = ttl }
	o.on('-p', '--password[PASSWORD]', "Use password protection on server side (no additional encryption)") { |password|
		opts[:pass] = true
		opts[:password] = password unless password.nil?
	}
	o.on('-s', '--site SITE', "Post upload to another ezcrypt pastebin (default: https://ezcrypt.it)") { |s| opts[:site] = s }
	o.separator ""
	o.separator "    If neither url nor filename was given, a final parameter can be used to specify it. Urls are autodetected."
	o.separator ""
	o.on('-h', '--help', "Show this help") { STDERR.puts o; exit }
	o.parse!
	if ARGV.length == 1
		if opts[:url] || opts[:fn]
			STDERR.puts o
			exit 1
		end
		begin
			url = URI(ARGV[0])
			if ("http" == url.scheme || "https" == url.scheme) && url.host
				opts[:url] = url
			else
				opts[:fn] = ARGV[0]
			end
		rescue
			opts[:fn] = ARGV[0]
		end
	end
	if ARGV.length > 1 or (opts[:url] and (opts[:fn] || opts[:ttl] || opts[:mime] || opts[:site] || opts[:pass])) or (!opts[:url] and !opts[:fn])
		STDERR.puts o
		exit 1
	end
end

if opts[:pass] and opts[:password].nil?
	if opts[:fn] == '-'
		STDERR.puts "Can't read post data from stdin and prompt for password"
		exit 1
	end
	STDERR.write "Enter password: "
	STDERR.flush
	opts[:password] = STDIN.readline.chomp
end

if opts[:url]
	uri = opts[:url]
	if !uri.fragment
		STDERR.puts "Specified url has no fragment, cannot decode paste"
		exit 1
	end

	password = nil
	while
		if password.nil?
			resp = http_get(uri)
		else
			resp = http_post(uri, :p => hashpw(password))
		end

		if 200 != resp.code.to_i
			STDERR.puts "Got HTTP/#{resp.http_version} #{resp.code} #{resp.message}"
			STDERR.puts "Location: #{resp['Location']}" if resp['Location']
			exit 1
		end
		html = resp.body

		if m = (/<input type="hidden" name="data" id="data" value="([^"]+)"/m.match(html) || (!password.nil? && /"data":"([^"]+)"/m.match(html)))
			cipher = m[1]
			STDOUT.write decrypt(cipher, uri.fragment)
			exit 0
		elsif html =~ /<div id="askpassword">/ and password.nil?
			STDERR.write "Paste is password protected. Enter password: "
			STDERR.flush
			password = STDIN.readline.chomp
		else
			STDERR.puts "Can't parse response."
			exit 1
		end
	end

else
	uri = URI(opts[:site] || 'https://ezcrypt.it')
	if opts[:fn] != '-'
		if opts[:mime].nil?
			begin
				opts[:mime] = IO.popen("file --brief --mime-type '#{opts[:fn]}'", "r").read.chomp
			rescue
				# use default mime type text/plain
			end
		end
		text = File.open(opts[:fn], "rb").read
	else
		text = STDIN.read
	end

	cipher, key = encrypt(text)
	resp = http_post(uri, :data => cipher, :syn => opts[:mime] || 'text/plain', :ttl => opts[:ttl] || (7*86400), :p => hashpw(opts[:password]))
	if 200 != resp.code.to_i
		STDERR.puts "Key is #{key}"
		STDERR.puts "Got HTTP/#{resp.http_version} #{resp.code} #{resp.message}"
		resp.each_header { |k,v| STDERR.puts "#{k}: #{v}" }
		STDERR.puts resp.body
		exit 1
	end
	html = resp.body
	if html =~ /^\{"id":".*"\}\s*$/m then
		id = html.gsub(/^\{"id":"/m, "").gsub(/"\}\s*$/m, "")
		uri.path += '/' unless ?/ == uri.path[-1]
		uri.path += id
		uri.fragment = key
		puts uri
	else
		STDERR.puts "Key is #{key}"
		STDERR.puts "Can't parse response #{resp.body}"
		exit 1
	end
end
