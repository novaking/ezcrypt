
(function() {
#INCLUDE crypto-js/crypto/crypto.js
#INCLUDE crypto-js/sha1/sha1.js
#INCLUDE crypto-js/hmac/hmac.js
#INCLUDE crypto-js/pbkdf2/pbkdf2.js
#INCLUDE crypto-js/blockmodes/blockmodes.js
#INCLUDE crypto-js/aes/aes.js

	var b = {
		decrypt: function(key, block) {
			return Crypto.AES.decrypt(block, key);
		},

		encrypt: function(key, block) {
			return Crypto.AES.decrypt(block, key);
		},

		sha: function(text) {
			return Crypto.SHA1(text);
		},

		randomKey: function(callback) {
			var index = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var key = '';
			for( var i = 1; i < 25; i++ ) { key += index[Math.floor( Math.random() * index.length )] };
			callback(key);
		},
	};

	if (!window.crypto_backends) window.crypto_backends = {};
	window.crypto_backends['CRYPTO_JS'] = b;
	if (!window.ezcrypt_backend) window.ezcrypt_backend = b;
})();
