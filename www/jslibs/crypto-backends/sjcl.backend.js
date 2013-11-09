
(function() {
#INCLUDE sjcl/core/sjcl.js
#INCLUDE sjcl/core/aes.js
#INCLUDE sjcl/core/bitArray.js
#INCLUDE sjcl/core/codecBase64.js
#INCLUDE sjcl/core/codecBytes.js
#INCLUDE sjcl/core/codecHex.js
#INCLUDE sjcl/core/codecString.js
#INCLUDE sjcl/core/hmac.js
#INCLUDE sjcl/core/pbkdf2.js
#INCLUDE sjcl/core/sha1.js
#INCLUDE sjcl/core/sha256.js
#INCLUDE sjcl/core/random.js

	function derive_key(key, iv) {
		return sjcl.misc.pbkdf2(key, iv, 1, 256, function (password) { return new sjcl.misc.hmac(password, sjcl.hash.sha1); });
	}

	/* en- and decrypt */
	function ofb(prp, data, iv) {
		if (sjcl.bitArray.bitLength(iv) !== 128) {
			throw new sjcl.exception.invalid("ofb iv must be 128 bits");
		}
		var i,
				w = sjcl.bitArray,
				bl = w.bitLength(data),
				bp = 0,
				output = data.slice(); /* duplicate */

		for (i=0; bp <= bl; i+=4, bp+=128) {
			iv = prp.encrypt(iv);
			output[i] ^= iv[0];
			output[i+1] ^= iv[1];
			output[i+2] ^= iv[2];
			output[i+3] ^= iv[3];
		}
		/* clamp output */
		output.splice((bl+31) >> 5);
		bl = bl % 32;
		if (bl > 0) {
			output[output.length-1] = w.partial(bl, output[output.length-1] & 0x80000000 >> (bl-1), 1);
		}

		return output;
	}

	var b = {
		decrypt: function(key, block) {
			var data = sjcl.codec.base64.toBits(block);
			var iv = data.splice(0, 4); /* extract 4 32-bit ints = 128 bits */
			var aes = new sjcl.cipher.aes(derive_key(key, iv));
			return sjcl.codec.utf8String.fromBits(ofb(aes, data, iv));
		},

		encrypt: function(key, block) {
			var data = sjcl.codec.utf8String.toBits(block);
			var iv = sjcl.random.randomWords(4, 0); /* should have enough entropy after we got the key */
			var aes = new sjcl.cipher.aes(derive_key(key, iv));
			var cipher = ofb(aes, data, iv);
			cipher.splice(0,0,iv[0],iv[1],iv[2],iv[3]);
			return sjcl.codec.base64.fromBits(cipher);
		},

		sha: function(text) {
			return sjcl.codec.hex.fromBits(sjcl.hash.sha1.hash(text));
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
			var key = sjcl.codec.base64url.fromBits(sjcl.random.randomWords(8));
			callback(key);
		},
	};

	if (!window.crypto_backends) window.crypto_backends = {};
	window.crypto_backends['sjcl'] = b;
	if (!window.ezcrypt_backend) window.ezcrypt_backend = b;
}) ();
