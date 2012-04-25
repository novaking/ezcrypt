/* jscrypto library, random number generator
 *   by GUAN Zhi <guanzhi at guanzhi dot org>
 */
 
if (!this.jscrypto) {jscrypto = {};}

var random

jscrypto.rand = {

	bit_count: 0,
	word_count: 0,

	init: function() {
	},
	
	bytes: function(nbytes) {
	},
	
	collectEntropy: function() {
	}

};

jscrypto.entropy = {
	
	collect: function() {
	},
	
	measure: function() {
	}

};

jscrypto.rand.entropy = new Array();
jscrypto.rand.entropyCount = 0;
jscrypto.rand.entropyMax = 1024;




function rand_bytes(length) {
	return rand_pseudo_bytes(length);
}

function rand_pseudo_bytes(length) {
	var bytes = new Array(length);
	for (var i = 0; i < length; i++)
		bytes[i] = Math.ceil( Math.random() * 255 );
	return bytes;
}

var entropy = new Array();
var entropy_estimate = 0;
var entropy_max = 1024;





document.onmousemove = rngGetEntropyFromMouse;
document.onkeypress = rngGetEntropyFromKeyboard;
//rngGetEntropyFromBowser();

document.form.x.value = "hello";


// get browser window size 4 bytes
function rngGetEntropyFromBrowser() {
	entropy[entropy.length] = window.innerHeight / 256;
	entropy[entropy.length] = window.innerHeight % 256;
	entropy[entropy.length] = window.innerWidth / 256;
	entropy[entropy.length] = window.innerWidth % 256;
	entropy_estimate += 4;
	if (entropy_estimate >= entropy_max) {
		rngExtractRandomSeed();
	}
	document.form.x.value = entropy_estimate;
}

// get current time stamp 2 bytes
function rngGetEntropyFromTime() {
	var d = new Date();
	//entropy[entropy.length] = d.getTime() / 256;
	//entropy[entropy.length] = d.getTime() % 256;
	//entropy_estimate += 2;
	if (entropy_estimate >= entropy_max) {
		rngExtractRandomSeed();
	}
	document.form.x.value = entropy_estimate;
}

// get key stock and time 3 bytes
function rngGetEntropyFromKeyboard(e) {
	var keynum;
	var keychar;	
	if (window.event) {
		keynum = e.keyCode;
	} else if (e.which) {
		keynum = e.which;
	}
	//entropy[entropy.length] = keynum % 256;
	//entropy_estimate += 1;		
	//captureEntropyFromTime(e);
	document.form.x.value = entropy_estimate;
}

// get mouse position 2 bytes
function rngGetEntropyFromMouse(e) {
	var k = (e.pageX % 16) * 16 + (e.pageY % 16);
	entropy[entropy.length] = k;
	entropy_estimate += 1;
	if (entropy_estimate >= entropy_max) {
		rngExtractRandomSeed();
	}
	document.form.x.value = entropy_estimate;
}

function rngExtractRandomSeed() {
	document.form.ta.value = entropy.toString();
	document.onmousemove = null;
}

function rngGenAesCbcMac(data, key) {
	AES_Init();
	AES_ExpandKey(key);
	for (var i = 0; i < data.length / 16; i++) {
		
	}
}

function rngGenHMacSha1(data, key) {
	var mac = hmac_sha1(data, key);
	return mac;
}

function rngGenerateRandom(nbytes) {
	
	for (var i = 0; i < nbytes / rngBlockSize; i++) {
		state ^= sha1(state);
		out += sha1(state);
	}

	if (nbytes % rngBlockSize) {
		var last;
		state ^= sha1(state);
		last = sha1(state);
		out += last.slice(0, nbytes % rngBlockSize)
	}
}




