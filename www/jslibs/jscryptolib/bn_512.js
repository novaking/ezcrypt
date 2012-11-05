/* jscrypto library, number theory
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

function bn_513_cmp(a, b) {
	var t;
	t = a[17] - b[17]; if (t) return t;
	t = a[16] - b[16]; if (t) return t;
	t = a[15] - b[15]; if (t) return t;
	t = a[14] - b[14]; if (t) return t;
	t = a[13] - b[13]; if (t) return t;
	t = a[12] - b[12]; if (t) return t;
	t = a[11] - b[11]; if (t) return t;
	t = a[10] - b[10]; if (t) return t;
	t = a[ 9] - b[ 9]; if (t) return t;
	t = a[ 8] - b[ 8]; if (t) return t;
	t = a[ 7] - b[ 7]; if (t) return t;
	t = a[ 6] - b[ 6]; if (t) return t;
	t = a[ 5] - b[ 5]; if (t) return t;
	t = a[ 4] - b[ 4]; if (t) return t;
	t = a[ 3] - b[ 3]; if (t) return t;
	t = a[ 2] - b[ 2]; if (t) return t;
	t = a[ 1] - b[ 1]; if (t) return t;
	return a[0] - b[0];
}

function bn_513_add(a, b) {
	var r = a.slice(0);
	var t;
	t =  a[ 0] + b[ 0]; r[ 0] = t & 0x7ffffff; t >>> 27;
	t += a[ 1] + b[ 1]; r[ 1] = t & 0x7ffffff; t >>> 27;
	t += a[ 2] + b[ 2]; r[ 2] = t & 0x7ffffff; t >>> 27;
	t += a[ 3] + b[ 3]; r[ 3] = t & 0x7ffffff; t >>> 27;
	t += a[ 4] + b[ 4]; r[ 4] = t & 0x7ffffff; t >>> 27;
	t += a[ 5] + b[ 5]; r[ 5] = t & 0x7ffffff; t >>> 27;
	t += a[ 6] + b[ 6]; r[ 6] = t & 0x7ffffff; t >>> 27;
	t += a[ 7] + b[ 7]; r[ 7] = t & 0x7ffffff; t >>> 27;
	t += a[ 8] + b[ 8]; r[ 8] = t & 0x7ffffff; t >>> 27;
	t += a[ 9] + b[ 9]; r[ 9] = t & 0x7ffffff; t >>> 27;
	t += a[10] + b[10]; r[10] = t & 0x7ffffff; t >>> 27;
	t += a[11] + b[11]; r[11] = t & 0x7ffffff; t >>> 27;
	t += a[12] + b[12]; r[12] = t & 0x7ffffff; t >>> 27;
	t += a[13] + b[13]; r[13] = t & 0x7ffffff; t >>> 27;
	t += a[14] + b[14]; r[14] = t & 0x7ffffff; t >>> 27;
	t += a[15] + b[15]; r[15] = t & 0x7ffffff; t >>> 27;
	t += a[16] + b[16]; r[16] = t & 0x7ffffff; t >>> 27;
	t += a[17] + b[17]; r[17] = t & 0x7ffffff;
	return r;
}


