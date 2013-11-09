
(function() {
#INCLUDE crypto-js/crypto/crypto.js
#INCLUDE crypto-js/sha1/sha1.js
#INCLUDE crypto-js/hmac/hmac.js
#INCLUDE crypto-js/pbkdf2/pbkdf2.js
#INCLUDE crypto-js/blockmodes/blockmodes.js
#INCLUDE crypto-js/aes/aes.js
#INCLUDE sjcl/core/sjcl.js
#INCLUDE sjcl/core/aes.js
#INCLUDE sjcl/core/bitArray.js
#INCLUDE sjcl/core/sha256.js
#INCLUDE sjcl/core/random.js

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
			var col_started = false;
			if (!sjcl.random.isReady()) {
				if (!sjcl.random._collectorsStarted) {
					sjcl.random.startCollectors();
					col_started = true;
				}
				setTimeout(function () {
					b.randomKey(callback);
					if (col_started) sjcl.random.stopCollectors();
				}, 200);
				return;
			}
			var key = Crypto.util.bytesToBase64(Crypto.util.wordsToBytes(sjcl.random.randomWords(8)));
			callback(key);
		},
	};

	if (!window.crypto_backends) window.crypto_backends = {};
	window.crypto_backends['CRYPTO_JS'] = b;
	if (!window.ezcrypt_backend) window.ezcrypt_backend = b;
})();
