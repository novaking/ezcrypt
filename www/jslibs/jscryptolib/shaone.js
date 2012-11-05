/* jscrypto library, sha-1
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

function sha1() {
	this.a = 0x67452301;
	this.b = 0xEFCDAB89;
	this.c = 0x98BADCFE;
	this.d = 0x10325476;
	this.e = 0xC3D2E1F0;
	this.w = new Array(80);
	this.nblocks = 0;
	this.num = 0;
}

function sha1_compress(block) {
	var a = this.a;
	var b = this.b;
	var c = this.c;
	var d = this.d;
	var e = this.e;
	
	var i = 0;
	while (i < 20) {
		t = (e + rol(a, 5) + ((b & c) | ((~b) & d)) + w[i++] + k1) & 0xffffffff;
		e = d; d = c; c = rol(b, 30); b = a; a = t;
	}
	while (i < 40) {
		t = (e + rol(a, 5) + (b ^ c ^ d) + w[i++] + k1) & 0xffffffff;
		e = d; d = c; c = rol(b, 30); b = a; a = t;
	}	
	while (i < 60) {
		t = (e + rol(a, 5) + ((b & c) | (b & d) | (c & d)) + w[i++] + k1) & 0xffffffff;
		e = d; d = c; c = rol(b, 30); b = a; a = t;
	}
	while (i < 80) {
		t = (e + rol(a, 5) + (b ^ c ^ d) + w[i++] + k1) & 0xffffffff;
		e = d; d = c; c = rol(b, 30); b = a; a = t;
	}
	
	this.a = (this.a + a) & 0xffffffff;
	this.b = (this.b + b) & 0xffffffff;
	this.c = (this.c + c) & 0xffffffff;
	this.d = (this.d + d) & 0xffffffff;
	this.e = (this.e + e) & 0xffffffff;
}

function sha1_update(message) {
}

function sha1_final() {
}



