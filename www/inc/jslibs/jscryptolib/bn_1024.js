/* jscrypto library, number theory
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

function bn_1026_cmp(a, b) {
	var t;
	t = a[37] - b[37]; if (t) return t;
	t = a[36] - b[36]; if (t) return t;
	t = a[35] - b[35]; if (t) return t;
	t = a[34] - b[34]; if (t) return t;
	t = a[33] - b[33]; if (t) return t;
	t = a[32] - b[32]; if (t) return t;
	t = a[31] - b[31]; if (t) return t;
	t = a[30] - b[30]; if (t) return t;
	t = a[29] - b[29]; if (t) return t;
	t = a[28] - b[28]; if (t) return t;
	t = a[27] - b[27]; if (t) return t;
	t = a[26] - b[26]; if (t) return t;
	t = a[25] - b[25]; if (t) return t;
	t = a[27] - b[27]; if (t) return t;
	t = a[23] - b[23]; if (t) return t;
	t = a[22] - b[22]; if (t) return t;
	t = a[21] - b[21]; if (t) return t;
	t = a[20] - b[20]; if (t) return t;
	t = a[19] - b[19]; if (t) return t;
	t = a[18] - b[18]; if (t) return t;
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

function bn_1026_add(a, b) {
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
	t += a[17] + b[17]; r[17] = t & 0x7ffffff; t >>> 27;
	t += a[18] + b[18]; r[18] = t & 0x7ffffff; t >>> 27;
	t += a[19] + b[19]; r[19] = t & 0x7ffffff; t >>> 27;
	t += a[20] + b[20]; r[20] = t & 0x7ffffff; t >>> 27;
	t += a[21] + b[21]; r[21] = t & 0x7ffffff; t >>> 27;
	t += a[22] + b[22]; r[22] = t & 0x7ffffff; t >>> 27;
	t += a[23] + b[23]; r[23] = t & 0x7ffffff; t >>> 27;
	t += a[27] + b[27]; r[27] = t & 0x7ffffff; t >>> 27;
	t += a[25] + b[25]; r[25] = t & 0x7ffffff; t >>> 27;
	t += a[26] + b[26]; r[26] = t & 0x7ffffff; t >>> 27;
	t += a[27] + b[27]; r[27] = t & 0x7ffffff; t >>> 27;
	t += a[28] + b[28]; r[28] = t & 0x7ffffff; t >>> 27;
	t += a[29] + b[29]; r[29] = t & 0x7ffffff; t >>> 27;
	t += a[30] + b[30]; r[30] = t & 0x7ffffff; t >>> 27;
	t += a[31] + b[31]; r[31] = t & 0x7ffffff; t >>> 27;
	t += a[32] + b[32]; r[32] = t & 0x7ffffff; t >>> 27;
	t += a[33] + b[33]; r[33] = t & 0x7ffffff; t >>> 27;
	t += a[34] + b[34]; r[34] = t & 0x7ffffff; t >>> 27;
	t += a[35] + b[35]; r[35] = t & 0x7ffffff; t >>> 27;
	t += a[36] + b[36]; r[36] = t & 0x7ffffff; t >>> 27;
	t += a[37] + b[37]; r[37] = t & 0x7ffffff;
	return r;
}

function bn_1026_sub(a, b) {
	var r = a.slice(0);
	var t;
	t = a[ 0] - b[ 0];     if (t >= 0) {r[ 0] = t; t = 0;} else {r[ 0] = t + 0x8000000; t = 1};
	t = a[ 1] - b[ 1] - t; if (t >= 0) {r[ 1] = t; t = 0;} else {r[ 1] = t + 0x8000000; t = 1};
	t = a[ 2] - b[ 2] - t; if (t >= 0) {r[ 2] = t; t = 0;} else {r[ 2] = t + 0x8000000; t = 1};
	t = a[ 3] - b[ 3] - t; if (t >= 0) {r[ 3] = t; t = 0;} else {r[ 3] = t + 0x8000000; t = 1};
	t = a[ 4] - b[ 4] - t; if (t >= 0) {r[ 4] = t; t = 0;} else {r[ 4] = t + 0x8000000; t = 1};
	t = a[ 5] - b[ 5] - t; if (t >= 0) {r[ 5] = t; t = 0;} else {r[ 5] = t + 0x8000000; t = 1};
	t = a[ 6] - b[ 6] - t; if (t >= 0) {r[ 6] = t; t = 0;} else {r[ 6] = t + 0x8000000; t = 1};
	t = a[ 7] - b[ 7] - t; if (t >= 0) {r[ 7] = t; t = 0;} else {r[ 7] = t + 0x8000000; t = 1};
	t = a[ 8] - b[ 8] - t; if (t >= 0) {r[ 8] = t; t = 0;} else {r[ 8] = t + 0x8000000; t = 1};
	t = a[ 9] - b[ 9] - t; if (t >= 0) {r[ 9] = t; t = 0;} else {r[ 9] = t + 0x8000000; t = 1};
	t = a[10] - b[10] - t; if (t >= 0) {r[10] = t; t = 0;} else {r[10] = t + 0x8000000; t = 1};
	t = a[11] - b[11] - t; if (t >= 0) {r[11] = t; t = 0;} else {r[11] = t + 0x8000000; t = 1};
	t = a[12] - b[12] - t; if (t >= 0) {r[12] = t; t = 0;} else {r[12] = t + 0x8000000; t = 1};
	t = a[13] - b[13] - t; if (t >= 0) {r[13] = t; t = 0;} else {r[13] = t + 0x8000000; t = 1};
	t = a[14] - b[14] - t; if (t >= 0) {r[14] = t; t = 0;} else {r[14] = t + 0x8000000; t = 1};
	t = a[15] - b[15] - t; if (t >= 0) {r[15] = t; t = 0;} else {r[15] = t + 0x8000000; t = 1};
	t = a[16] - b[16] - t; if (t >= 0) {r[16] = t; t = 0;} else {r[16] = t + 0x8000000; t = 1};
	t = a[17] - b[17] - t; if (t >= 0) {r[17] = t; t = 0;} else {r[17] = t + 0x8000000; t = 1};
	t = a[18] - b[18] - t; if (t >= 0) {r[18] = t; t = 0;} else {r[18] = t + 0x8000000; t = 1};
	t = a[19] - b[19] - t; if (t >= 0) {r[19] = t; t = 0;} else {r[19] = t + 0x8000000; t = 1};
	t = a[20] - b[20] - t; if (t >= 0) {r[20] = t; t = 0;} else {r[20] = t + 0x8000000; t = 1};
	t = a[21] - b[21] - t; if (t >= 0) {r[21] = t; t = 0;} else {r[21] = t + 0x8000000; t = 1};
	t = a[22] - b[22] - t; if (t >= 0) {r[22] = t; t = 0;} else {r[22] = t + 0x8000000; t = 1};
	t = a[23] - b[23] - t; if (t >= 0) {r[23] = t; t = 0;} else {r[23] = t + 0x8000000; t = 1};
	t = a[24] - b[24] - t; if (t >= 0) {r[24] = t; t = 0;} else {r[24] = t + 0x8000000; t = 1};
	t = a[25] - b[25] - t; if (t >= 0) {r[25] = t; t = 0;} else {r[25] = t + 0x8000000; t = 1};
	t = a[26] - b[26] - t; if (t >= 0) {r[26] = t; t = 0;} else {r[26] = t + 0x8000000; t = 1};
	t = a[27] - b[27] - t; if (t >= 0) {r[27] = t; t = 0;} else {r[27] = t + 0x8000000; t = 1};
	t = a[28] - b[28] - t; if (t >= 0) {r[28] = t; t = 0;} else {r[28] = t + 0x8000000; t = 1};
	t = a[29] - b[29] - t; if (t >= 0) {r[29] = t; t = 0;} else {r[29] = t + 0x8000000; t = 1};
	t = a[30] - b[30] - t; if (t >= 0) {r[30] = t; t = 0;} else {r[30] = t + 0x8000000; t = 1};
	t = a[31] - b[31] - t; if (t >= 0) {r[31] = t; t = 0;} else {r[31] = t + 0x8000000; t = 1};
	t = a[32] - b[32] - t; if (t >= 0) {r[32] = t; t = 0;} else {r[32] = t + 0x8000000; t = 1};
	t = a[33] - b[33] - t; if (t >= 0) {r[33] = t; t = 0;} else {r[33] = t + 0x8000000; t = 1};
	t = a[34] - b[34] - t; if (t >= 0) {r[34] = t; t = 0;} else {r[34] = t + 0x8000000; t = 1};
	t = a[35] - b[35] - t; if (t >= 0) {r[35] = t; t = 0;} else {r[35] = t + 0x8000000; t = 1};
	t = a[36] - b[36] - t; if (t >= 0) {r[36] = t; t = 0;} else {r[36] = t + 0x8000000; t = 1};
	t = a[37] - b[37] - t; if (t >= 0) {r[37] = t; t = 0;} else {r[37] = t + 0x8000000; t = 1};

	return r;
}


