/* jscrypto library, number theory
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */

var bn_zero;
var bn_one;

bn_zero = new Array(128);
for (var i = 0; i < bn_zero.length; i++) {
	bn_zero[i] = 0;
}
bn_one = bn_zero.slice(0);
bn_one[0] = 1;

function bn_pseudo_rand(max) {
	var r = max.slice(0);
	var i;
	for(i = 0; i < r.length - 2; i++) {
		r[i] = Math.round(Math.random() * 0x7ffffff);
	}
	do {
		r[i] = Math.round(Math.random() * 0x7ffffff);
	} while (r[i] >= max[i]);
	r[i + 1] = 0;
	return r;
}

function bn_rand(max) {
	return bn_pseudo_rand(max);
}

function bn_set_digit(a, digit) {
	a[0] = int & 0x7ffffff;
	for (var i = 1; i < a.length; i++) {
		a[i] = 0;
	}
}

function bn_to_le_bits(a) {
	var r = '';
	for (var i = 0; i < a.length; i++) {
		var t = a[i];
		for (var j = 0; j < 27; j++) {
			r += t & 1;
			t >>>= 1;
		}
	}
	return r.substring(0, r.lastIndexOf('1') + 1);
}

function bn_from_le_bits(b) {
	var r_len = Math.ceil((b.length + 1) / 27);
	var r = new Array(r_len);
	for (var i = 0; i < r_len; i ++) {
		var le = b.substring(i, i + 27);
		var mask = 1;
		for (var j = 0; j < 27; j++) {
			bn[i] |= mask;
			mask <<= 1;
		}
	}
	return a;	
}

function bn_to_bits(a) {
	return bn_to_le_bits(a).split("").reverse().join("");
}

function bn_from_bits(b) {
	return bn_from_le_bits(b.split("").reverse().join(""));
}

function bn_num_bits(a) {
	return bn_to_le_bits(a).length;
}

function bn_is_zero(a) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] != 0)
			return false;
	}
	return true;
}

function bn_is_one(a) {
	if (a[0] != 1)
		return false;
	for (var i = 1; i < a.length; i++) {
		if (a[i] != 0)
			return false;
	}
	return true;
}

function bn_cmp(a, b) {
	for (var i = a.length - 1; i >= 0; i--) {
		if (a[i] > b[i])
			return 1;
		if (a[i] < b[i])
			return -1;
	}
	return 0;
}

function bn_add(a, b) {
	var r = a.slice(0);
	var t = 0;
	for (var i = 0; i < a.length; i++) {
		t = a[i] + b[i] + t;
		r[i] = t & 0x7ffffff;
		t >>>= 27;
	}
	return r;
}

function bn_sub(a, b) {
	var r = a.slice(0);
	var t = 0;
	for (var i = 0; i < a.length; i++) {
		t = a[i] - b[i] - t;
		if (t >= 0) {
			r[i] = t;
			t = 0;
		} else {
			r[i] = 0x8000000 - t;
			t = 1;
		}
	}
	return r;
}

function bn_signed_add(a, b, a_neg, b_neg) {
	if (a_neg == b_neg) {
		return new Array(bn_add(a, b), a_neg);
	}
	if (bn_cmp(a, b) >= 0) {
		return new Array(bn_sub(a, b), a_neg);
	} else {
		return new Array(bn_sub(b, a), b_neg);
	}
}

function bn_signed_sub(a, b, a_neg, b_neg) {
	if (a_neg != b_neg)
		return new Array(bn_add(a, b), a_neg);
	if (bn_cmp(a, b) >= 0)
		return new Array(bn_sub(a, b), a_neg);
	else
		return new Array(bn_sub(b, a), a_neg ^ 1);
}

function bn_rshift1(a) {
	var r = a.slice(0);
	var t = a.length - 1;
	var i;
	for (i = 0; i < t; i++) {
		r[i] = a[i] >>> 1;
		if (a[i + 1] & 1)
			r[i] += 0x8000000;
	}
	r[i] = Math.floor(a[i] / 2);
	return r;
}

function bn_add_digit(a, digit) {
	var b = a.slice(0);
	bn_set_digit(b, digit);
	return bn_add(a, b);
}

function bn_sub_digit(a, digit) {
	var b = a.slice(0);
	bn_set_digit(b, digit);
	return bn_sub(a, b);
}

function bn_mul_digit(a, digit) {
	var a_len = a.length;
	var r = new Array(a_len);
	var i, t;
	var c = 0;
	for (i = 0; i < a_len; i++) {
		t = digit * a[i] + c;
		r[i] = t & 0x7ffffff;
		c = t >>> 27;
	}
	return r;
}

function bn_mul_operand_scan(a, b) {
	var a_len = a.length - 1;
	var b_len = b.length - 1;
	var r = bn_zero.slice(0, a_len + b_len + 1);
	var c, uv, k;
	for (var i = 0; i < a_len; i++) {
		c = 0;
		k = i;
		for (var j = 0; j < b_len; j++, k++) {
			uv = r[k] + a[i] * b[j] + c;
			r[k] = uv & 0x7ffffff;
			c = uv >>> 27;
		}
		r[i + b_len] = c;
	}
	return r;
}

function bn_mul_product_scan(a, b) {
	var t = a.length * 2 - 2;
	var r = bn_zero.slice(0, t + 1);
	var r0 = 0, r1 = 0, r2 = 0;
	var i, j, uv = 0;
	var t_1 = t - 1;
	for (i = 0; i < t_1; i++) {
		for (j = 0; j <= i; j++) {
			uv = a[j] * b[i - j];
			r0 += (uv & 0x7ffffff);
			r1 += (uv >>> 27) + (r0 >>> 27);
			r2 += (r1 >>> 27);
			r0 &= 0x7ffffff;
			r1 &= 0x7ffffff;
		}
		r[t] = r0;
		r0 = r1;
		r1 = r2;
		r2 = 0;
	}
	r[i] = r0;
	return r;
}

function bn_sqr(a) {
	var t = a.length * 2 - 2;
	var r = bn_zero.slice(0, t + 1);
	var r0 = 0, r1 = 0, r2 = 0;
	var i, j, uv = 0;
	var t_1 = t - 1;
	for (i = 0; i < t_1; i++) {
		for (j = 0; j <= i; j++) {
			uv = a[j] * a[i - j];
			if (j < i - j) {
				uv = uv * 2;
				r2 = r2;
			}
			r0 += v(uv);
			r1 += u(uv);
			r2 += e;
		}
		r[i] = r0;
		r0 = r1;
		r1 = r2;
		r2 = 0;
	}
	r[i] = r0;
	return r;
}

function bn_div(x, y) {

	var n = x.length - 2;
	var t = y.length - 2;
	var k = n - t;
	var yt = y[t];
	var y2 = new Array(y[t - 1], yt, 0);
	var q = bn_zero.slice(0, k + 2);
	var r = x.slice(k);
	
	while (bn_cmp(r, y) >= 0) {
		q[k]++;
		r = bn_sub(r, y);
	}
	while (--k >= 0) {
		r.unshift(x[k]);
		r.pop();
		q[k] = (r[t + 1] == yt) ? 65535 :
			Math.floor(((r[t + 1] * 65536) + r[t]) / yt);
		while (bn_cmp(bn_mul_digit(y2, q[k]), r.slice(t - 1)) > 0) {
			q[k]--;
		}
		qy = bn_mul_digit(y, q[k]);
		if (bn_cmp(r, qy) >= 0) {
			r = bn_sub(r, qy);
		} else {
			q[k]--;
			qy = bn_sub(qy, y);
			r = bn_sub(r, qy);
		}
	}
	return new Array(q, r);
}

function bn_mod_add(a, b, m) {
	var r = bn_add(a, b);
	if (bn_cmp(r, m) >= 0)
		r = bn_sub(r, m);
	return r;
}

function bn_mod_sub(a, b, m) {
	return bn_cmp(a, b) >= 0 ? 
		bn_sub(a, b) : bn_add(a, bn_sub(m, b));
}

function bn_mod_div2(a, m) {
	return bn_rshift1((a[0] & 1) ? bn_add(a, m) : a); 
}

function bn_mod_invert(a, p) {

	var u = a.slice(0);
	var v = p.slice(0);
	var x1 = bn_one.slice(0, p.length);
	var x2 = bn_zero.slice(0, p.length);
	var x1_neg = 0, x2_neg = 0;
	var signed;

	while (1) {
		while (u[0] % 2 == 0) {
			u = bn_rshift1(u);
			if (x1[0] & 1) {
				signed = bn_signed_add(x1, p, x1_neg, 0);
				x1 = signed[0];
				x1_neg = signed[1];
			}
			x1 = bn_rshift1(x1);
		}
		while (v[0] % 2 == 0) {
			v = bn_rshift1(v);
			if (x2[0] & 1) {
				signed = bn_signed_add(x2, p, x2_neg, 0);
				x2 = signed[0];
				x2_neg = signed[1];
			}
			x2 = bn_rshift1(x2);
		}
		
		if (bn_cmp(u, v) >= 0) {
			u = bn_sub(u, v);
			signed = bn_signed_sub(x1, x2, x1_neg, x2_neg);
			x1 = signed[0];
			x1_neg = signed[1];
		} else {
			v = bn_sub(v, u);
			signed = bn_signed_sub(x2, x1, x2_neg, x1_neg);
			x2 = signed[0];
			x2_neg = signed[1];
		}
		//FIXME:
		if (bn_is_one(u))
			return (x1_neg ? bn_sub(p, x1) : x1);
		if (bn_is_one(v))
			return (x2_neg ? bn_sub(p, x2) : x2);
	}
}

function bn_mod_mul(a, b, m) {
	return bn_div(bn_mul(a, b), m)[1];
}

function bn_mod_pow(a, k, n) {
	var r = bn_one.slice(0, n.length);
	var t = a.slice(0);
	var bits = bn_dump_bits(k);
	for (var i = 1; i < bits.length; i++) {
		t = bn_mod_sqr(t, n);
		if (bits.charAt(i) == '1') {
			r = bn_mod_mul(t, r, n);
		}
	}
	return r;
}

function bn_to_NAF(a) {
	var r;
	var nbits = bn_num_bits(a);
	var i = 0;
	while (nbits > 0) {
		if (a[0] & 1) {
			r[i] = 2 - (a[0] & 3);
			
			if (r[i] > 0)
				a = bn_sub(a, one);
			else 
				a = bn_add(a, one);
			
		} else {
			r[i] = 0;
		}
		a = bn_rshift1(a);
		i++;
	}
	return r;		
}

function bn_prime_miller_rabin(n, t) {
	var s = 0;
	var n_1 = bn_sub(n, bn_one);
	var n_2 = bn_sub(n_1, bn_one);
	var r = n_1.slice(0);
	while (r[0] & 1) {
		r = bn_rshift1(r);
		s++;
	}
	for (var i = 0; i < t; i++) {
		a = bn_pseudo_rand(n_2);
		y = bn_mod_pow(a, r, n);
		if (!bn_is_one(y) && bn_cmp(y, n_1)) {
			j = 1;
			while (j < s && bn_cmp(y, n_1)) {
				y = bn_mod_sqr(y, n);
				if (bn_is_one(y))
					return false;
				j++;
			}
			if (bn_cmp(y, n_1))
				return false;
		}
	}
	return true;
}

function bn_mod_pow_digit(g, e, m) {
	var a = bn_one.slice(0, m.length);
	var s = g.slice(0);
	while (e != 0) {
		if (e & 1) {
			a = bn_mod_mul(a, s, m);
		}
		e <<= 1;
		if (e != 0)
			s = bn_mod_sqr(s, m);
	}
	return a;
}




