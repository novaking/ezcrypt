/* jscrypto library, random number generator
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 *
 * 
 * ALGOR : ANSI X9.17 Pseudo-random Bit Generator, (HOC 5.3.1)
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

jscrypto.x917rng = function(cipher, key, seed) {
	this.cipher = new cipher(key);
	this.seed = seed.slice(0);	
	this.interval = new Array(this.cipher.blockSize);
	var datetime = (new Date).getTime();
	for (var i = 0; i < this.interval.length; i++) {
		this.interval[i] = datetime & 0xff;
		datetime >>> 8;
	}
	this.interval =  this.cipher.encrypt(this.interval);
};

jscrypto.x917rng.prototype.bytes(nbytes) = {
	var r = new Array();
	var block = this.interval.slice(0);
	var nblocks = Math.ceil(nbytes / this.cipher.blockSize);
	for (var i = 0; i < nblocks; i++) {
		for (var j = 0; j < block.length; j++) {
			block[j] = this.interval[j] ^ this.seed[j];
		}
		block = this.cipher.encrypt(block);
		for (var j = 0; j < block.length; j++) {
			this.seed[i] = this.interval[i] ^ block[i];
		}
		r.concat(block);
	}
	return r.slice(0, nbytes);
};

