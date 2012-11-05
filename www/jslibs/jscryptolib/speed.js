/* jscrypto library, number theory
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

function speed_md5() {
	var message = "1234567890";
	for (var i = 0; i < 6; i++) {
		message += message;
	}
	var date = new Date();
	var t0 = date.getTime();
	str_sha1(message);
	var date = new Date();
	var t1 = date.getTime();
	var Bps = Math.floor((message.length * 1000)/(t1 - t0));
	return Bps;
}

function speed_sha1() {
	var message = "1234567890";
	for (var i = 0; i < 6; i++) {
		message += message;
	}
	var date = new Date();
	var t0 = date.getTime();
	str_sha1(message);
	var date = new Date();
	var t1 = date.getTime();
	var Bps = Math.floor((message.length * 1000)/(t1 - t0));
	return Bps;
}

function speed_sha2() {
	var message = "1234567890";
	for (var i = 0; i < 6; i++) {
		message += message;
	}
	var date = new Date();
	var t0 = date.getTime();
	str_sha1(message);
	var date = new Date();
	var t1 = date.getTime();
	var Bps = Math.floor((message.length * 1000)/(t1 - t0));
	return Bps;
}

function speed_bn_mod_nistp192_mul() {
	var a = bn_pseudo_rand(bn_nistp192);
	var b = bn_pseudo_rand(bn_nistp192);
	var t0 = (new Date()).getTime();
	for (var i = 0; i < 1000; i++) {
		var c = bn_mod_nistp192_mul(a, b);
	}
	var t1 = (new Date()).getTime();
	return Math.round((1000 * 1000)/(t1 - t0));
}

function speed_bn_mod_mul() {
	var a = bn_pseudo_rand(bn_nistp192);
	var b = bn_pseudo_rand(bn_nistp192);
	var t0 = (new Date()).getTime();
	for (var i = 0; i < 1000; i++) {
		var c = bn_mod_mul(a, b, bn_nistp192);
	}
	var t1 = (new Date()).getTime();
	return Math.round((1000 * 1000)/(t1 - t0));
}

function speed_bn_mul() {
	var a = bn_pseudo_rand(bn_nistp192);
	var b = bn_pseudo_rand(bn_nistp192);
	var t0 = (new Date()).getTime();
	for (var i = 0; i < 1000; i++) {
		var c = bn_mul(a, b);
	}
	var t1 = (new Date()).getTime();
	return Math.round((1000 * 1000)/(t1 - t0));
}

function speed_secp192r1_double() {
	var Q = new ecpoint(
		bn_from_hex(secp192r1_kG[3].slice(0, 48)),
		bn_from_hex(secp192r1_kG[3].slice(48)));
	var t0 = (new Date()).getTime();
	for (var i = 0; i < 100; i++) {
		Q = secp192r1_double(Q);
	}
	var t1 = (new Date()).getTime();
	return Math.round((100 * 1000)/(t1 - t0));
}

function speed_secp192r1_mul_G() {
	var R;
	var t0 = (new Date()).getTime();
	for (var i = 0; i < 1; i++) {
		R = secp192r1_mul_G(secp192r1_n);
		R = secp192r1_mul_G(secp192r1_x);
		R = secp192r1_mul_G(secp192r1_y);
		R = secp192r1_mul_G(secp192r1_b);
	}
	var t1 = (new Date()).getTime();
	return ((4 * 1000)/(t1 - t0));
}

function speed_bn_add() {
	var a = bn_pseudo_rand(bn_nistp192);
	var b = bn_pseudo_rand(bn_nistp192);
	var t0 = (new Date()).getTime();
	for (var i = 0; i < 10000; i++) {
		var c = bn_add(a, b);
	}
	var t1 = (new Date()).getTime();
	return Math.round((10000 * 1000)/(t1 - t0));
	
}
