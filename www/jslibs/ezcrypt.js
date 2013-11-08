
(function() {
	window.ezcrypt = {
		aes: {
			encrypt: function(key, block) {
				return window.ezcrypt_backend.encrypt(key, block);
			},
			decrypt: function(key, block) {
				block = block.replace( /\n/gm, '' );
				return window.ezcrypt_backend.decrypt(key, block);
			},
		},
		sha: function(text) {
			return window.ezcrypt_backend.sha(text);
		},
	};
})();
