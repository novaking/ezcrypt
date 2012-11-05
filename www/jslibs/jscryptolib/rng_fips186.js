/* jscrypto library, random number generator
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 *
 * 
 * ALGOR : FIPS 186 Pseudorandom Number Generator, (HOC 5.3.1)
 * INPUT : 
 *     seed s, |s| = 64 bits; integer m; DES E-D-E key k
 * OUTPUT:
 *     x_1, x_2, ..., x_m, |x_i| = 64-bit
 * OPERATION:
 *     1. I = E_k(D), E is DES E-D-E, D is 64-bit date/time
 *     2. FOR i = 1 TO m:
 *         2.1 x_i = E_k(I   XOR s)
 *         2.2 s   = E_k(x_i XOR I)
 *     3. RETURN x_1, x_2, ..., x_m
 */

if (typeof(jscrypto) == 'undefined') {jscrypto = {};}

jscrypto.fips186rng = function(prime, seed) {
	this.prime = prime.slice(0);
	this.seed = seed.slice(0);
	
};

jscrypto.fips186rng.digest = function(t, c) {
	var t = t.toWords();
	var X = c.addPadding().toWords;
	digest.compress(X);
	return digest.final();
	
	
};
