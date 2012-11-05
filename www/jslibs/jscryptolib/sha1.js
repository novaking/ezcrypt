/* jscrypto library, sha-1
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

if (typeof(jscrypto) == 'undefined') { jscrypto = {}; }

jscrypto.sha1 = function() {
	this.name = 'sha1';
	this.digestLength = 20;
	this.blockSize = 64;
	this.A = 0x67452301;
	this.B = 0xEFCDAB89;
	this.C = 0x98BADCFE;
	this.D = 0x10325476;
	this.E = 0xC3D2E1F0;
	this.W = new Array(80);	
	this.block = new Array();
	this.nbits = 0;
};

jscrypto.sha1.name = 'sha1';
jscrypto.sha1.digestLength = 20;
jscrypto.sha1.blockSize = 64;

jscrypto.sha1.prototype = {
	update: function(m) {
		var bytes = typeof(m) == 'string' ? m.toUTF8() : m;
		
		if (this.buffer.length > 0) {
		}
		
		while (m.length >= 64) {
			jscrypto.sha1.compress(m.slice(0));
			this.nblocks++;
		}
	},

	final: function() {
		this.block.push(0x80);	
	},
	
	compress: function(block) {
		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;
		var e = this.e;
		var w = this.w;

		var i = 0;
		while (i < 16) {
			var j = i * 4;
			w[i] = (block[j] << 24) | (block[j + 1] << 16) |
				(block[j + 2] << 8) | block[j + 3];
			i++;
		}
		while (i < 80) {
			w[i] = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16];
			w[i] = (w[i] << 1) | (w[i] >>> 31);
			i++;
		}
		i = 0;
		while (i < 20) {
			t = (e + 
				((a << 5) | (a >>> 27)) + 
				((b & c) | ((~b) & d)) + 
				w[i++] + 1518500249) & 0xffffffff;
			e = d;
			d = c;
			c = (b << 30) | (b >>> 2);
			b = a;
			a = t;
		}
		while (i < 40) {
			t = (e + ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + w[j++] + 1859775393) & 0xffffffff;
			e = d;
			d = c;
			c = ((b << 30) | (b >>> 2));
			b = a;
			a = t;
		}	
		while (i < 60) {
			t = (e + ((a << 5) | (a >>> 27)) + ((b & c) | (b & d) | (c & d)) + w[i++] + -1894007588) & 0xffffffff;
			e = d;
			d = c;
			c = ((b << 30) | (b >>> 2));
			b = a;
			a = t;
		}
		while (i < 80) {
			t = (e + ((a << 5) | (a >>> 27)) + (b ^ c ^ d) + w[i++] + -899497514) & 0xffffffff;
			e = d;
			d = c;
			c = ((b << 30) | (b >>> 2));
			b = a;
			a = t;
		}
			
	}
};

jscrypto.sha1.digest = function(m) {
	var md = new jscrypto.sha1();
	md.update(m);
	return md.final(m);
};



