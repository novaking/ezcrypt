/* jscrypto library, cpk cryptosystem
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */


function cpk_gen_public_key(params, id) {
	var index = cpk_str2index(id);
	var pubkey = ecpoint_from_json();
	for (var i = 0; i < index.length; i++) {
		var factor = ecpoint_from_json(param[index[i]]);
		pubkey = ecpoint_add(pubkey, factor);
	}
	return pubkey;	
}

function str2index(str) {
	var index = new Array(32);
	var binb = core_sha1(str2binb(str),str.length * chrsz);	
	for (var i = 0; i < 32; i++) {
		var a = 1 << i;
		index[i] =  32 * i +
			((binb[0] & a) ? 1 : 0) +
			((binb[1] & a) ? 2 : 0) +
			((binb[2] & a) ? 4 : 0) +
			((binb[3] & a) ? 8 : 0) +
			((binb[4] & a) ? 16 : 0);
		
	}
	return index;
}

function cpk_gen_private_key2(id) {
	// var index = cpk_str2index(id);
	var key = "FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22830";
	return key;
}




