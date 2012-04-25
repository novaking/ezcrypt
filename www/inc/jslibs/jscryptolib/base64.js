/* jscrypto library, base64
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

if (typeof(jscrypto) == 'undefined') { jscrypto = {}; }

jscrypto.base64 = {};
jscrypto.base64.encode = base64_encode;
jscrypto.base64.decode = base64_decode;
jscrypto.base64.encoder = function() { this.buffer = new Array(); };
jscrypto.base64.decoder = function() { this.buffer = ''; };
jscrypto.base64._map_ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

jscrypto.base64.encoder.prototype.update = function(bytes) {
	var r = '';
	this.buffer.concat(bytes);
	var len = this.buffer.length - this.buffer.length % 3;
	for (var i = 0; i < len; i += 3) {
		r += this._map_[this.buffer[i] >> 2] + 
			 this._map_[(this.buffer[i] & 3) << 4 | this.buffer[i+1] >> 4] + 
			 this._map_[(this.buffer[i+1] & 15) << 2 | this.buffer[i+2] >> 6] + 
			 this._map_[this.buffer[i+2] & 63];
	}
	this.buffer = this.buffer.slice(len);
	return r;
};

jscrypto.base64.encoder.prototype.final = function(bytes) {
	this.append = {};
	if (this.buffer.length > 0) {
		var append = 3 - this.buffer.length;
		this.buffer.concat([0,0]);
		r += 0;
		
		for (var i = 0; i < append; i++) {
			r += '=';
		}
	}
};

jscrypto.base64.decoder.prototype.update = function(b64) {
};

jscrypto.base64.decoder.prototype.final = function(b64) {
};

var B64MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function base64_encode(bytes) {
	var i = 0; j = 0;
	var append = bytes.length % 3 > 0 ? 3 - bytes.length % 3 : 0;
	for (i = 0; i < append; i++) {
		bytes[bytes.length] = 0;
	}
	var b64 = "";
	for (i = 0; j < bytes.length; j += 3) {
		if (j > 0 && j % 57 == 0) {
			b64 += '\n';
		}
		b64 += B64MAP[bytes[j] >> 2]
			+ B64MAP[(bytes[j] & 3) << 4 | bytes[j+1] >> 4]
			+ B64MAP[(bytes[j+1] & 15) << 2 | bytes[j+2] >> 6]
			+ B64MAP[bytes[j+2] & 63];
	}
	for (i = 0; i < append; i++) {
		b64 += '=';
	}
	return b64;
}

function base64_decode(input)
{
	var i = 0, j = 0;
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	var append = input.length % 4;
	if (append > 2) {
		return "shit1";
	}
	for (i = 0; i < append; i++) {
		if (input.charAt(input.length - i - 1) != '=') {
			return "shit2";
		}
	}
	var output = new Array((input.length - append) * 3 / 4);
	var enc1, enc2, enc3, enc4;
	for (i = 0, j = 0; j < output.length;) {
		enc1 = B64MAP.indexOf(input.charAt(i++));
		enc2 = B64MAP.indexOf(input.charAt(i++));
		enc3 = B64MAP.indexOf(input.charAt(i++));
		enc4 = B64MAP.indexOf(input.charAt(i++));
		output[j++] = (enc1 << 2) | (enc2 >> 4);
		output[j++] = ((enc2 & 15) << 4) | (enc3 >> 2);
		output[j++] = ((enc3 & 3) << 6) | enc4;
	}
	for (i = 0; i < append; i++) {
		if (output.pop() != 0) {
			return "shit3";
		}
	}
	return output;
}





