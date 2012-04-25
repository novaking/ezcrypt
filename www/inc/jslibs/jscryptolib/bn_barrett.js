/* jscrypto library, big number, barrett reduction
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

function bn_barrett(m) {
	this.k = m.length;
	var b2k = bn_zero.slice(0, 2 * this.k + 1);
	b2k[2 * this.k] = 1;
	this.mu = bn_div(b2k, m);
	this.bkplus1 = bn_zero.slice(0, this.k + 1);
}

function bn_mod_barrett(a, barrett) {
	
}

function bn_mod_barrett_add(a, b, barrett) {
}

function bn_mod_barrett_sub(a, b, barrett) {
}

function bn_mod_barrett_mul(a, b, barrett) {
	return bn_mod_barrett(bn_mul(a, b), barrett);
}

function bn_mod_barrett_pow(a, b, barrett) {	
}


