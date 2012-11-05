/* jscrypto library, aes in cbc mode with padding
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

if (typeof(jscrypto) == 'undefined') { jscrypto = {}; };
if (typeof(jscrypto.pkcs5) == 'undefined') { jscrypto.pkcs5 = {}; };

jscrypto.pkcs5.kdf1 = function(passwd, salt, count, digest) {
	this.salt = typeof(salt) != 'undefined' ? salt : 
		jscrypto.rand.bytes(jscrypto.pkcs5.defaultSaltLength);
	this.count = typeof(count) == 'undefined' ? count :
		jscrypto.pkcs5.defaultCount;
	this.digest = typeof(digest) != 'undefined' ? digest :
		jscrypto.pkcs5.defaultDigest;
	this.key = password.toBytes().concat(salt);
	for (var i = 0; i < count; i++) {
		this.key = digest.digest(this.key);
	}
};

jscrypto.pkcs5.kdf1.prototype = {
	
	generateKey: function(password, salt) {
		this.salt = typeof(salt) != 'undefined' ? salt : 
		jscrypto.rand.bytes(jscrypto.pkcs5.defaultSaltLength);
	},
	
	toString: function() {
	}
	
};

jscrypto.pkcs5.pbkdf2 = function(digest, password, salt, count) {
	
	var prf = function(p, s, c, n) {
	};
	
};

jscrypto.pkcs5.pbes1 = function(password, salt, count, digest, cipher) {
	this.digest = digest;
	this.salt = salt.slice(0);
	this.key = jscrypto.pkcs5.kdf1
};

jscrypto.pkcs5.pbes1.prototype = {
	
	encryptUpdate: function(d) {
	},
	
	encryptFinal: function(d) {
	},
	
	decryptUpdate: function(d) {
	},
	
	decryptFinal: function(d) {
	}
	
};


jscrypto.pkcs5.pbes2 = function(password, salt, count, digest, cipher) {
};



