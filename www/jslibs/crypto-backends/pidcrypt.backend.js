
(function() {
#INCLUDE pidCrypt/pidcrypt_util.js
#INCLUDE pidCrypt/pidcrypt.js
#INCLUDE pidCrypt/md5.js
#INCLUDE pidCrypt/aes_core.js
#INCLUDE pidCrypt/aes_cbc.js

	var b = {
		decrypt: function(key, block) {
			return pidCrypt.AES.CBC.decryptText(block, key, { nBits: 128 });
		},

		encrypt: function(key, block) {
			return pidCrypt.AES.CBC.encryptText(block, key, { nBits: 128 });
		},

		sha: function(text) {
			return pidCrypt.SHA1(text);
		},

		randomKey: function(callback) {
			var index = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var key = '';
			for( var i = 1; i < 25; i++ ) { key += index[Math.floor( Math.random() * index.length )] };
			callback(key);
		},
	};

	if (!window.crypto_backends) window.crypto_backends = {};
	window.crypto_backends['PIDCRYPT'] = b;
	if (!window.ezcrypt_backend) window.ezcrypt_backend = b;
})();
