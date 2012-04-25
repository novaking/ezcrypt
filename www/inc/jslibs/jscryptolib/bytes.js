/* jscrypto library, aes in cbc mode with padding
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

if (typeof(jscrypto) == 'undefined') { jscrypto = {}; };

function padding_add(a) {
	var pad = 16 - a.length % 16;
	for (var i = 0; i < pad; i++) {
		a.push(pad);
	}
	return a;
};

function padding_remove(a) {
	if (a.length % 16 == 0) {
		var pad = a.pop() % 17;
		for (var i = 0; i < pad; i++) {
			a.pop();
		}
	}
	return a;
};



