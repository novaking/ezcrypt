/* jscrypto library, random number generator
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 *
 */

if (typeof(jscrypto) == 'undefined') {jscrypto = {};}

jscrypto.rand.rsarng = function(seed, p, q, e) {
	var e = jscrypto.integer.fromDigit(65537);
	var this.rsa = new jscrypto.rsa(p, q, e);
};

jscrypto.rand.rsarng.prototype.bytes(nbytes) {
	var bits = '';
	var nbits = nbytes * 8;
	var x;
	for (var i = 0; i < nbits; i++) {
		x = jscrypto.rsa.power(x);
		bits += String(x[0] & 1);
	};
	return jscrypto.integer.fromBits(bits);
};

jscrypto.rand.micaliSchnorr = function(seed, p, q, e) {
};

jscrypto.rand.micaliSchnorr.prototype.bytes(nbytes) {
};

jscrypto.rand.bbs = function(seed, p, q, e) {
	this.n = jscrypto.integer.multily(p, q);
};

jscrypto.rand.bbs.prototype.bytes = function(nbytes) {
	var bits = '';
	var x = new Array();
	for (var i = 0; i < nbits; i++) {
		x = jscrypto.integer.modSquare(x, this.n);
		bits += String(x[0] & 1);
	}
	return jscrypto.integer.fromBits(bits);
};








