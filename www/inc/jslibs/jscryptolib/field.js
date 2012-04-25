/* jscrypto library, number theory
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */
 
if (typeof(jscrypto) == 'undefined') { jscrypto = {}; }

jscrypto.primeField = function(prime) {
	this.modulo = p.slice(0);
	this.barrett = 0;
};

jscrypto.primeField.prototype = {
	compare: bn_cmp,
	add: function(a, b) {
		return bn_mod_add(a, b, this.modulo);
	},
	subtract: function(a, b) {
		return bn_mod_sub(a, b, this.modulo);
	},
	multiply: function(a ,b) {
		return bn_mod_mul(a, b, this.modulo);
	},
	invert: function(a) {
		return bn_mod_invert(a, this.prime);
	}
};

jscrypto.primeField160bits = function(prime) {
	this.modulo = prime.slice(0);
};


jscrypto.nistp192Field = function() {
};

jscrypto.nistp192Field.prototype = {
	compare: bn_cmp,
	add: function(a, b) {
	},
	subtract: function(a, b) {
	},
	multiply: function(a, b) {
	}
};




