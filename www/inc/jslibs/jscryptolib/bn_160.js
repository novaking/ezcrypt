/* jscrypto library, number theory
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */
 
function bn_162_cmp(a, b) {
	var t;
	t = a[5] - b[5]; if (t) return t;
	t = a[4] - b[4]; if (t) return t;
	t = a[3] - b[3]; if (t) return t;
	t = a[2] - b[2]; if (t) return t;
	t = a[1] - b[1]; if (t) return t;
	return a[0] - b[0];
}

function bn_162_add(a, b) {
	var r = a.slice(0);
	var t = 0;
	t =  a[ 0] + b[ 0]; r[ 0] = t & 0x7ffffff; t >>> 27;
	t += a[ 1] + b[ 1]; r[ 1] = t & 0x7ffffff; t >>> 27;
	t += a[ 2] + b[ 2]; r[ 2] = t & 0x7ffffff; t >>> 27;
	t += a[ 3] + b[ 3]; r[ 3] = t & 0x7ffffff; t >>> 27;
	t += a[ 4] + b[ 4]; r[ 4] = t & 0x7ffffff; t >>> 27;
	t += a[ 5] + b[ 5]; r[ 5] = t & 0x7ffffff;
	return r;
}

function bn_162_sub(a, b) {
	var r = a.slice(0);
	var t = 0;
	t = a[0] - b[0];     if (t >= 0) {r[0] = t; t = 0;} else {r[0] = t + 0x8000000; t = 1};
	t = a[1] - b[1] - t; if (t >= 0) {r[1] = t; t = 0;} else {r[1] = t + 0x8000000; t = 1};
	t = a[2] - b[2] - t; if (t >= 0) {r[2] = t; t = 0;} else {r[2] = t + 0x8000000; t = 1};
	t = a[3] - b[3] - t; if (t >= 0) {r[3] = t; t = 0;} else {r[3] = t + 0x8000000; t = 1};
	t = a[4] - b[4] - t; if (t >= 0) {r[4] = t; t = 0;} else {r[4] = t + 0x8000000; t = 1};
	t = a[5] - b[5] - t; if (t >= 0) {r[5] = t; t = 0;} else {r[5] = t + 0x8000000; t = 1};
	return r;
}
