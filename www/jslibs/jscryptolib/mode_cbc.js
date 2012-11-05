/* jscrypto library,
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */
 

if (typeof(jscrypto) == 'undefined') { jscrypto = {}; };
if (typeof(jscrypto.mode) == 'undefined') {jscrypto.mode = {}; };

jscrypto.mode.ecb = {
	encryptor: function(cipher, key, iv, pad) {
		this.cipher = new cipher(key);
		this.iv = iv ? iv.slice(0) : 
			jscrypto.rand.bytes(cipher.blockSize);
		this.pad = pad ? Boolean(pad) : true;
		this.buffer = new Array();
	},
	decryptor: function(cipher, key, iv, pad) {
		this.cipher = new cipher(key);
		this.iv = iv.slice(0);
		this.pad = pad ? Boolean(pad) : true;
		this.buffer = new Array();
	}
};

jscrypto.mode.ecb.encryptor.prototype = {
	update: function(bytes) {
		var r = new Array();
		this.buffer.concat(bytes);
		var len = this.buffer.length - this.buffer.length % this.cipher.blockSize;
		for (var i = 0; i < len; i += this.cipher.blockSize) {
			r.concat(this.cipher.encrypt(this.buffer.slice(i, i + this.cipher.blockSize)));
		}
		this.buffer = this.buffer.slice(len);
		return r;
	},
	final: function(bytes) {
		var r = this.update(bytes);
		if (this.pad == true) {
			this.buffer.addPadding();
			r.concat(this.cipher.encrypt(this.buffer));
		}
		return r;
	}
};

jscrypto.mode.ecb.decryptor.prototype = {
	update: function(bytes) {
		var r = new Array();
		this.buffer.concat(bytes);
		var len = this.buffer.length - this.buffer.length % this.cipher.blockSize;
		for (var i = 0; i < len; i += this.cipher.blockSize) {
			r.concat(this.cipher.decrypt(this.buffer.slice(i, i + this.cipher.blockSize)));
		}
		this.buffer = this.buffer.slice(len);
		return r;
	},
	final: function(bytes) {
		var r = this.update(bytes);
		if (this.pad == true) {
			this.buffer.addPadding();
			r.concat(this.cipher.decrypt(this.buffer));
		}
		return r;
	}
};

