/* jscrypto: JavaScript Cryptography Library, HMAC
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 *
 * HMAC_k(m) = H((k ^ opad), H((k ^ ipad), m))
 * pseudo-code:
 * function hmac(key, message)
 *	opad = [0x5c * blocksize]
 *	ipad = [0x36 * blocksize]
 *	if (key.length > blocksize) then
 *		key = hash(key)
 *	end if
 *	for i from 0 to length(key) - 1 step 1
 *		ipad[i] = ipad[i] XOR key[i]
 *		opad[i] = opad[i] XOR key[i]
 *	end for
 *	return hash(opad || hash(ipad || message))
 * end function
 */
 
if (typeof(jscrypto) == 'undefined') { jscrypto = {}; }

jscrypto.hmac = function(key, digest) {
	
	/* public attributes */
	this.name = 'hmac-' + digest.name;
	this.macLength = digest.digestLength;
	this.blockSize = digest.blockSize;
	
	/* private attributes */
	this.key = key.length <= digest.blockSize ? key.slice(0) : digest.digest(key);
	while (this.key.length < this.blockSize) {
		this.key.push(0);
	}
	var opad = this.key;
	var ipad = this.key.slice(0);
	for (var i = 0; i < this.blockSize; i++) {
		opad[i] ^= 0x5c;
		ipad[i] ^= 0x36;
	}
	this.digest = new digest();
	this.digest.update(ipad);
	
};

jscrypto.hmac.prototype = {
	update: function(msg) {
		return this.digest.update(msg);
	},
	final: function() {
		return this.digest.digest(this.key.concat(this.digest.final()));
	}
};

