/* jscrypto library, aes in cbc mode with padding
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

if (typeof(jscrypto) == 'undefined') { jscrypto = {}; }

jscrypto.aes = function(key) {
	this.name = jscrypto.aes.name + '-' + key.length * 8;
	this.keyLength = key.length;
	this.blockSize = jscrypto.aes.blockSize;
	this._key = key.slice(0);
	AES_ExpandKey(this._key);
};

jscrypto.aes.name = 'aes';
jscrypto.aes.blockSize = 16;
jscrypto.aes.minKeyLength = 16;
jscrypto.aes.maxKeyLength = 32;

jscrypto.aes.prototype = {
	encrypt: function(block) {
		AES_Encrypt(block, this._key);
		return block;
	},
	decrypt: function(block) {
		AES_Decrypt(block, this._key);
		return block;
	}
};

