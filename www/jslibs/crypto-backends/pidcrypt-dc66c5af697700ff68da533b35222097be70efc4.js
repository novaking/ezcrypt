
(function() {
/* pidCrypt/pidcrypt_util.js */
 /*----------------------------------------------------------------------------*/
 // Copyright (c) 2009 pidder <www.pidder.com>
 // Permission to use, copy, modify, and/or distribute this software for any
 // purpose with or without fee is hereby granted, provided that the above
 // copyright notice and this permission notice appear in all copies.
 //
 // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*----------------------------------------------------------------------------*/
/*  (c) Chris Veness 2005-2008
* You are welcome to re-use these scripts [without any warranty express or
* implied] provided you retain my copyright notice and when possible a link to
* my website (under a LGPL license). §ection numbers relate the code back to
* sections in the standard.
/*----------------------------------------------------------------------------*/
/* Helper methods (base64 conversion etc.) needed for different operations in
 * encryption.

/*----------------------------------------------------------------------------*/
/* Intance methods extanding the String object                                */
/*----------------------------------------------------------------------------*/
/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * As per RFC 4648, no newlines are added.
 *
 * @param utf8encode optional parameter, if set to true Unicode string is
 *                   encoded into UTF-8 before conversion to base64;
 *                   otherwise string is assumed to be 8-bit characters
 * @return coded     base64-encoded string
 */
pidCryptUtil = {};
pidCryptUtil.encodeBase64 = function(str,utf8encode) {  // http://tools.ietf.org/html/rfc4648
  if(!str) str = "";
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;

  plain = utf8encode ? pidCryptUtil.encodeUTF8(str) : str;

  c = plain.length % 3;  // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

  for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);

    bits = o1<<16 | o2<<8 | o3;

    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into b64 string
    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');  // join() is far faster than repeated string concatenation

  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length-pad.length) + pad;
  return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * As per RFC 4648, newlines are not catered for.
 *
 * @param utf8decode optional parameter, if set to true UTF-8 string is decoded
 *                   back into Unicode after conversion from base64
 * @return           decoded string
 */
pidCryptUtil.decodeBase64 = function(str,utf8decode) {
  if(!str) str = "";
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
  var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;

  coded = utf8decode ? pidCryptUtil.decodeUTF8(str) : str;

  for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));

    bits = h1<<18 | h2<<12 | h3<<6 | h4;

    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;

    d[c/4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
  }
  plain = d.join('');  // join() is far faster than repeated string concatenation

  plain = utf8decode ? pidCryptUtil.decodeUTF8(plain) : plain

  return plain;
}

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @return encoded string
 */
pidCryptUtil.encodeUTF8 = function(str) {
  if(!str) str = "";
  // use regular expressions & String.replace callback function for better efficiency
  // than procedural approaches
  str = str.replace(
      /[u0080-u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  str = str.replace(
      /[u0800-uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return str;
}

// If you encounter problems with the UTF8 encode function (e.g. for use in a
// Firefox) AddOn) you can use the following instead.
// code from webtoolkit.com

//pidCryptUtil.encodeUTF8 = function(str) {
//		str = str.replace(/rn/g,"n");
//		var utftext = "";
//
//		for (var n = 0; n < str.length; n++) {
//
//			var c = str.charCodeAt(n);
//
//			if (c < 128) {
//				utftext += String.fromCharCode(c);
//			}
//			else if((c > 127) && (c < 2048)) {
//				utftext += String.fromCharCode((c >> 6) | 192);
//				utftext += String.fromCharCode((c & 63) | 128);
//			}
//			else {
//				utftext += String.fromCharCode((c >> 12) | 224);
//				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
//				utftext += String.fromCharCode((c & 63) | 128);
//			}
//
//		}
//
//  return utftext;
//}



/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @return decoded string
 */
pidCryptUtil.decodeUTF8 = function(str) {
  if(!str) str = "";
  str = str.replace(
      /[u00c0-u00df][u0080-u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  str = str.replace(
      /[u00e0-u00ef][u0080-u00bf][u0080-u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f);
        return String.fromCharCode(cc); }
    );
  return str;
}

// If you encounter problems with the UTF8 decode function (e.g. for use in a
// Firefox) AddOn) you can use the following instead.
// code from webtoolkit.com

//pidCryptUtil.decodeUTF8 = function(utftext) {
//    var str = "";
//		var i = 0;
//		var c = 0;
//    var c1 = 0;
//    var c2 = 0;
//
//		while ( i < utftext.length ) {
//
//			c = utftext.charCodeAt(i);
//
//			if (c < 128) {
//				str += String.fromCharCode(c);
//				i++;
//			}
//			else if((c > 191) && (c < 224)) {
//				c1 = utftext.charCodeAt(i+1);
//				str += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
//				i += 2;
//			}
//			else {
//				c1 = utftext.charCodeAt(i+1);
//				c2 = utftext.charCodeAt(i+2);
//				str += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
//				i += 3;
//			}
//
//		}
//
//
//  return str;
//}




/**
 * Converts a string into a hexadecimal string
 * returns the characters of a string to their hexadecimal charcode equivalent
 * Works only on byte chars with charcode < 256. All others chars are converted
 * into "xx"
 *
 * @return hex string e.g. "hello world" => "68656c6c6f20776f726c64"
 */
pidCryptUtil.convertToHex = function(str) {
  if(!str) str = "";
  var hs ='';
  var hv ='';
  for (var i=0; i<str.length; i++) {
    hv = str.charCodeAt(i).toString(16);
    hs += (hv.length == 1) ? '0'+hv : hv;
  }
  return hs;
}

/**
 * Converts a hex string into a string
 * returns the characters of a hex string to their char of charcode
 *
 * @return hex string e.g. "68656c6c6f20776f726c64" => "hello world"
 */
pidCryptUtil.convertFromHex = function(str){
  if(!str) str = "";
  var s = "";
  for(var i= 0;i<str.length;i+=2){
    s += String.fromCharCode(parseInt(str.substring(i,i+2),16));
  }
  return s
}

/**
 * strips off all linefeeds from a string
 * returns the the strong without line feeds
 *
 * @return string
 */
pidCryptUtil.stripLineFeeds = function(str){
  if(!str) str = "";
//  var re = RegExp(String.fromCharCode(13),'g');//r
//  var re = RegExp(String.fromCharCode(10),'g');//n
  var s = '';
  s = str.replace(/n/g,'');
  s = s.replace(/r/g,'');
  return s;
}

/**
 * Converts a string into an array of char code bytes
 * returns the characters of a hex string to their char of charcode
 *
 * @return hex string e.g. "68656c6c6f20776f726c64" => "hello world"
 */
 pidCryptUtil.toByteArray = function(str){
  if(!str) str = "";
  var ba = [];
  for(var i=0;i<str.length;i++)
     ba[i] = str.charCodeAt(i);

  return ba;
}


/**
 * Fragmentize a string into lines adding a line feed (lf) every length
 * characters
 *
 * @return string e.g. length=3 "abcdefghi" => "abcndefnghin"
 */
pidCryptUtil.fragment = function(str,length,lf){
  if(!str) str = "";
  if(!length || length>=str.length) return str;
  if(!lf) lf = 'n'
  var tmp='';
  for(var i=0;i<str.length;i+=length)
    tmp += str.substr(i,length) + lf;
  return tmp;
}

/**
 * Formats a hex string in two lower case chars + : and lines of given length
 * characters
 *
 * @return string e.g. "68656C6C6F20" => "68:65:6c:6c:6f:20:n"
*/
pidCryptUtil.formatHex = function(str,length){
  if(!str) str = "";
    if(!length) length = 45;
    var str_new='';
    var j = 0;
    var hex = str.toLowerCase();
    for(var i=0;i<hex.length;i+=2)
      str_new += hex.substr(i,2) +':';
    hex = this.fragment(str_new,length);

  return hex;
}


/*----------------------------------------------------------------------------*/
/* End of intance methods of the String object                                */
/*----------------------------------------------------------------------------*/

pidCryptUtil.byteArray2String = function(b){
//  var out ='';
  var s = '';
  for(var i=0;i<b.length;i++){
     s += String.fromCharCode(b[i]);
//     out += b[i]+':';
  }
//  alert(out);
  return s;
}
/* pidCrypt/pidcrypt.js */
/*!Copyright (c) 2009 pidder <www.pidder.com>*/
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License as
// published by the Free Software Foundation; either version 2 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
// 02111-1307 USA or check at http://www.gnu.org/licenses/gpl.html

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* pidCrypt is pidders JavaScript Crypto Library - www.pidder.com/pidcrypt
 * Version 0.04, 10/2009

 *
 * pidCrypt is a combination of different JavaScript functions for client side
 * encryption technologies with enhancements for openssl compatibility cast into
 * a modular class concept.
 *
 * Client side encryption is a must have for developing host proof applications:
 * There must be no knowledge of the clear text data at the server side, all
 * data is enrycpted prior to being submitted to the server.
 * Client side encryption is mandatory for protecting the privacy of the users.
 * "Dont't trust us, check our source code!"
 *
 * "As a cryptography and computer security expert, I have never understood
 * the current fuss about the open source software movement. In the
 * cryptography world, we consider open source necessary for good security;
 * we have for decades. Public security is always more secure than proprietary
 * security. It's true for cryptographic algorithms, security protocols, and
 * security source code. For us, open source isn't just a business model;
 * it's smart engineering practice."
 * Bruce Schneier, Crypto-Gram 1999/09/15
 * copied form keepassx site - keepassx is a cross plattform password manager
 *
 * pidCrypt comes with modules under different licenses and copyright terms.
 * Make sure that you read and respect the individual module license conditions
 * before using it.
 *
 * The pidCrypt base library contains:
 * 1. pidcrypt.js
 *    class pidCrypt: the base class of the library
 * 2. pidcrypt_util.js
 *    base64 en-/decoding as new methods of the JavaScript String class
 *    UTF8 en-/decoding as new methods of the JavaScript String class
 *    String/HexString conversions as new methods of the JavaScript String class
 *
 * The pidCrypt v0.01 modules and the original authors (see files for detailed
 * copyright and license terms) are:
 *
 * - md5.js:      MD5 (Message-Digest Algorithm), www.webtoolkit.info
 * - aes_core.js: AES (Advanced Encryption Standard ) Core algorithm, B. Poettering
 * - aes-ctr.js:  AES CTR (Counter) Mode, Chis Veness
 * - aes-cbc.js:  AES CBC (Cipher Block Chaining) Mode, pidder
 * - jsbn.js:     BigInteger for JavaScript, Tom Wu
 * - prng.js:     PRNG (Pseudo-Random Number Generator), Tom Wu
 * - rng.js:      Random Numbers, Tom Wu
 * - rsa.js:      RSA (Rivest, Shamir, Adleman Algorithm), Tom Wu
 * - oids.js:     oids (Object Identifiers found in ASN.1), Peter Gutmann
 * - asn1.js:     ASN1 (Abstract Syntax Notation One) parser, Lapo Luchini
 * - sha256.js    SHA-256 hashing, Angel Marin 
 * - sha2.js:     SHA-384 and SHA-512 hashing, Brian Turek
 *
 * IMPORTANT:
 * Please report any bugs at http://sourceforge.net/projects/pidcrypt/
 * Vist http://www.pidder.com/pidcrypt for online demo an documentation
 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

function pidCrypt(){
  //TODO: better radomness!
  function getRandomBytes(len){
    if(!len) len = 8;
    var bytes = new Array(len);
    var field = [];
    for(var i=0;i<256;i++) field[i] = i;
    for(i=0;i<bytes.length;i++)
      bytes[i] = field[Math.floor(Math.random()*field.length)];
    return bytes
  }

  this.setDefaults = function(){
     this.params.nBits = 256;
  //salt should always be a Hex String e.g. AD0E76FF6535AD...
     this.params.salt = getRandomBytes(8);
     this.params.salt = pidCryptUtil.byteArray2String(this.params.salt);
     this.params.salt = pidCryptUtil.convertToHex(this.params.salt);
     this.params.blockSize = 16;
     this.params.UTF8 = true;
     this.params.A0_PAD = true;
  }

  this.debug = true;
  this.params = {};
  //setting default values for params
  this.params.dataIn = '';
  this.params.dataOut = '';
  this.params.decryptIn = '';
  this.params.decryptOut = '';
  this.params.encryptIn = '';
  this.params.encryptOut = '';
  //key should always be a Hex String e.g. AD0E76FF6535AD...
  this.params.key = '';
  //iv should always be a Hex String e.g. AD0E76FF6535AD...
  this.params.iv = '';
  this.params.clear = true;
  this.setDefaults();
  this.errors = '';
  this.warnings = '';
  this.infos = '';
  this.debugMsg = '';
  //set and get methods for base class
  this.setParams = function(pObj){
    if(!pObj) pObj = {};
    for(var p in pObj)
      this.params[p] = pObj[p];
  }
  this.getParams = function(){
    return this.params;
  }
  this.getParam = function(p){
    return this.params[p] || '';
  }
  this.clearParams = function(){
      this.params= {};
  }
  this.getNBits = function(){
    return this.params.nBits;
  }
  this.getOutput = function(){
    return this.params.dataOut;
  }
  this.setError = function(str){
    this.error = str;
  }
  this.appendError = function(str){
    this.errors += str;
    return '';
  }
  this.getErrors = function(){
    return this.errors;
  }
  this.isError = function(){
    if(this.errors.length>0)
      return true;
    return false
  }
  this.appendInfo = function(str){
    this.infos += str;
    return '';
  }
  this.getInfos = function()
  {
    return this.infos;
  }
  this.setDebug = function(flag){
    this.debug = flag;
  }
  this.appendDebug = function(str)
  {
    this.debugMsg += str;
    return '';
  }
  this.isDebug = function(){
    return this.debug;
  }
  this.getAllMessages = function(options){
    var defaults = {lf:'n',
                    clr_mes: false,
                    verbose: 15//verbose level bits = 1111
        };
    if(!options) options = defaults;
    for(var d in defaults)
      if(typeof(options[d]) == 'undefined') options[d] = defaults[d];
    var mes = '';
    var tmp = '';
    for(var p in this.params){
      switch(p){
        case 'encryptOut':
          tmp = pidCryptUtil.toByteArray(this.params[p].toString());
          tmp = pidCryptUtil.fragment(tmp.join(),64, options.lf)
          break;
        case 'key': 
        case 'iv':
          tmp = pidCryptUtil.formatHex(this.params[p],48);
          break;
        default:
          tmp = pidCryptUtil.fragment(this.params[p].toString(),64, options.lf);
      }  
      mes += '<p><b>'+p+'</b>:<pre>' + tmp + '</pre></p>';
    }  
    if(this.debug) mes += 'debug: ' + this.debug + options.lf;
    if(this.errors.length>0 && ((options.verbose & 1) == 1)) mes += 'Errors:' + options.lf + this.errors + options.lf;
    if(this.warnings.length>0 && ((options.verbose & 2) == 2)) mes += 'Warnings:' +options.lf + this.warnings + options.lf;
    if(this.infos.length>0 && ((options.verbose & 4) == 4)) mes += 'Infos:' +options.lf+ this.infos + options.lf;
    if(this.debug && ((options.verbose & 8) == 8)) mes += 'Debug messages:' +options.lf+ this.debugMsg + options.lf;
    if(options.clr_mes)
      this.errors = this.infos = this.warnings = this.debug = '';
    return mes;
  }
  this.getRandomBytes = function(len){
    return getRandomBytes(len);
  }
  //TODO warnings
}

/* pidCrypt/md5.js */
/**
*
*  MD5 (Message-Digest Algorithm) for use in pidCrypt Library
*  Depends on pidCrypt (pidcrypt.js, pidcrypt_util.js)
*
*  For original source see http://www.webtoolkit.info/
*  Download: 15.02.2009 from http://www.webtoolkit.info/javascript-md5.html
**/

if(typeof(pidCrypt) != 'undefined') {
  pidCrypt.MD5 = function(string) {

    function RotateLeft(lValue, iShiftBits) {
      return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
      var lX4,lY4,lX8,lY8,lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1=lMessageLength + 8;
      var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
      var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
      var lWordArray=Array(lNumberOfWords-1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while ( lByteCount < lMessageLength ) {
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
      lWordArray[lNumberOfWords-2] = lMessageLength<<3;
      lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
      return lWordArray;
    };

    function WordToHex(lValue) {
      var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
      for (lCount = 0;lCount<=3;lCount++) {
        lByte = (lValue>>>(lCount*8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
      }
      return WordToHexValue;
    };

    //**	function Utf8Encode(string) removed. Aready defined in pidcrypt_utils.js

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    //	string = Utf8Encode(string); #function call removed

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
      AA=a; BB=b; CC=c; DD=d;
      a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
      d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
      c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
      b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
      a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
      d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
      c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
      b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
      a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
      d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
      c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
      b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
      a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
      d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
      c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
      b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
      a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
      d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
      c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
      b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
      a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
      d=GG(d,a,b,c,x[k+10],S22,0x2441453);
      c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
      b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
      a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
      d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
      c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
      b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
      a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
      d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
      c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
      b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
      a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
      d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
      c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
      b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
      a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
      d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
      c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
      b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
      a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
      d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
      c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
      b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
      a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
      d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
      c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
      b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
      a=II(a,b,c,d,x[k+0], S41,0xF4292244);
      d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
      c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
      b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
      a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
      d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
      c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
      b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
      a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
      d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
      c=II(c,d,a,b,x[k+6], S43,0xA3014314);
      b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
      a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
      d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
      c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
      b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
      a=AddUnsigned(a,AA);
      b=AddUnsigned(b,BB);
      c=AddUnsigned(c,CC);
      d=AddUnsigned(d,DD);
    }
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
    return temp.toLowerCase();
  }
}
/* pidCrypt/aes_core.js */
/*!Copyright (c) 2009 pidder <www.pidder.com>*/
/*----------------------------------------------------------------------------*/
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License as
// published by the Free Software Foundation; either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
// 02111-1307 USA or check at http://www.gnu.org/licenses/gpl.html

/*----------------------------------------------------------------------------*/
/*
*  pidCrypt AES core implementation for block en-/decryption for use in pidCrypt
*  Library.
*  Derived from jsaes version 0.1 (See original license below)
*  Only minor Changes (e.g. using a precompiled this.SBoxInv) and port to an
*  AES Core Class for use with different AES modes.
*
*  Depends on pidCrypt (pidcrypt.js, pidcrypt_util.js)
/*----------------------------------------------------------------------------*/
/*    jsaes version 0.1  -  Copyright 2006 B. Poettering
 *    http://point-at-infinity.org/jsaes/
 *    Report bugs to: jsaes AT point-at-infinity.org
 *
 *
 * This is a javascript implementation of the AES block cipher. Key lengths
 * of 128, 192 and 256 bits are supported.
 * The well-functioning of the encryption/decryption routines has been
 * verified for different key lengths with the test vectors given in
 * FIPS-197, Appendix C.
 * The following code example enciphers the plaintext block '00 11 22 .. EE FF'
 * with the 256 bit key '00 01 02 .. 1E 1F'.
 *    AES_Init();
 *    var block = new Array(16);
 *    for(var i = 0; i < 16; i++)
 *        block[i] = 0x11 * i;
 *    var key = new Array(32);
 *    for(var i = 0; i < 32; i++)
 *        key[i] = i;
 *    AES_ExpandKey(key);
 *    AES_Encrypt(block, key);
 *    AES_Done();
/*----------------------------------------------------------------------------*/

if(typeof(pidCrypt) != 'undefined'){
  pidCrypt.AES = function(env) {
    this.env = (env) ? env : new pidCrypt();
    this.blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
    this.ShiftRowTabInv; //initialized by init()
    this.xtime; //initialized by init()
    this.SBox = new Array(
      99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,
      118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,
      147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,
      7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,
      47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,
      251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,
      188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,
      100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,
      50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,
      78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,
      116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,
      158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,
      137,13,191,230,66,104,65,153,45,15,176,84,187,22
    );
    this.SBoxInv = new Array(
      82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,
      251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,233,203,84,123,148,50,
      166,194,35,61,238,76,149,11,66,250,195,78,8,46,161,102,40,217,36,178,118,91,
      162,73,109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,204,93,101,
      182,146,108,112,72,80,253,237,185,218,94,21,70,87,167,141,157,132,144,216,
      171,0,140,188,211,10,247,228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,193,
      175,189,3,1,19,138,107,58,145,17,65,79,103,220,234,151,242,207,206,240,180,
      230,115,150,172,116,34,231,173,53,133,226,249,55,232,28,117,223,110,71,241,
      26,113,29,41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,198,210,121,32,
      154,219,192,254,120,205,90,244,31,221,168,51,136,7,199,49,177,18,16,89,39,
      128,236,95,96,81,127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,224,
      59,77,174,42,245,176,200,235,187,60,131,83,153,97,23,43,4,126,186,119,214,38,
      225,105,20,99,85,33,12,125
    );
    this.ShiftRowTab = new Array(0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11);
  }
/*
init: initialize the tables needed at runtime. Call this function
before the (first) key expansion.
*/
  pidCrypt.AES.prototype.init = function() {
    this.env.setParams({blockSize:this.blockSize});
    this.ShiftRowTabInv = new Array(16);
    for(var i = 0; i < 16; i++)
      this.ShiftRowTabInv[this.ShiftRowTab[i]] = i;
    this.xtime = new Array(256);
    for(i = 0; i < 128; i++) {
      this.xtime[i] = i << 1;
      this.xtime[128 + i] = (i << 1) ^ 0x1b;
    }
  }
/*
AES_ExpandKey: expand a cipher key. Depending on the desired encryption
strength of 128, 192 or 256 bits 'key' has to be a byte array of length
16, 24 or 32, respectively. The key expansion is done "in place", meaning
that the array 'key' is modified.
*/
  pidCrypt.AES.prototype.expandKey = function(input) {
    var key = input.slice();
    var kl = key.length, ks, Rcon = 1;
    switch (kl) {
      case 16: ks = 16 * (10 + 1); break;
      case 24: ks = 16 * (12 + 1); break;
      case 32: ks = 16 * (14 + 1); break;
      default:
        alert("AESCore.expandKey: Only key lengths of 16, 24 or 32 bytes allowed!");
    }
    for(var i = kl; i < ks; i += 4) {
      var temp = key.slice(i - 4, i);
      if (i % kl == 0) {
        temp = new Array(this.SBox[temp[1]] ^ Rcon, this.SBox[temp[2]],
                         this.SBox[temp[3]], this.SBox[temp[0]]);
        if ((Rcon <<= 1) >= 256)
          Rcon ^= 0x11b;
      }
      else if ((kl > 24) && (i % kl == 16))
        temp = new Array(this.SBox[temp[0]], this.SBox[temp[1]],
      this.SBox[temp[2]], this.SBox[temp[3]]);
      for(var j = 0; j < 4; j++)
        key[i + j] = key[i + j - kl] ^ temp[j];
    }
    return key;
  }
/*
AES_Encrypt: encrypt the 16 byte array 'block' with the previously
expanded key 'key'.
*/
  pidCrypt.AES.prototype.encrypt = function(input, key) {
    var l = key.length;
    var block = input.slice();
    this.addRoundKey(block, key.slice(0, 16));
    for(var i = 16; i < l - 16; i += 16) {
      this.subBytes(block);
      this.shiftRows(block);
      this.mixColumns(block);
      this.addRoundKey(block, key.slice(i, i + 16));
    }
    this.subBytes(block);
    this.shiftRows(block);
    this.addRoundKey(block, key.slice(i, l));

    return block;
  }
/*
AES_Decrypt: decrypt the 16 byte array 'block' with the previously
expanded key 'key'.
*/
  pidCrypt.AES.prototype.decrypt = function(input, key) {
    var l = key.length;
    var block = input.slice();
    this.addRoundKey(block, key.slice(l - 16, l));
    this.shiftRows(block, 1);//1=inverse operation
    this.subBytes(block, 1);//1=inverse operation
    for(var i = l - 32; i >= 16; i -= 16) {
      this.addRoundKey(block, key.slice(i, i + 16));
      this.mixColumns_Inv(block);
      this.shiftRows(block, 1);//1=inverse operation
      this.subBytes(block, 1);//1=inverse operation
    }
    this.addRoundKey(block, key.slice(0, 16));

    return block;
  }
  pidCrypt.AES.prototype.subBytes = function(state, inv) {
    var box = (typeof(inv) == 'undefined') ? this.SBox.slice() : this.SBoxInv.slice();
    for(var i = 0; i < 16; i++)
      state[i] = box[state[i]];
  }
  pidCrypt.AES.prototype.addRoundKey = function(state, rkey) {
    for(var i = 0; i < 16; i++)
      state[i] ^= rkey[i];
  }
  pidCrypt.AES.prototype.shiftRows = function(state, inv) {
    var shifttab = (typeof(inv) == 'undefined') ? this.ShiftRowTab.slice() : this.ShiftRowTabInv.slice();
    var h = new Array().concat(state);
    for(var i = 0; i < 16; i++)
      state[i] = h[shifttab[i]];
  }
  pidCrypt.AES.prototype.mixColumns = function(state) {
    for(var i = 0; i < 16; i += 4) {
      var s0 = state[i + 0], s1 = state[i + 1];
      var s2 = state[i + 2], s3 = state[i + 3];
      var h = s0 ^ s1 ^ s2 ^ s3;
      state[i + 0] ^= h ^ this.xtime[s0 ^ s1];
      state[i + 1] ^= h ^ this.xtime[s1 ^ s2];
      state[i + 2] ^= h ^ this.xtime[s2 ^ s3];
      state[i + 3] ^= h ^ this.xtime[s3 ^ s0];
    }
  }
  pidCrypt.AES.prototype.mixColumns_Inv = function(state) {
    for(var i = 0; i < 16; i += 4) {
      var s0 = state[i + 0], s1 = state[i + 1];
      var s2 = state[i + 2], s3 = state[i + 3];
      var h = s0 ^ s1 ^ s2 ^ s3;
      var xh = this.xtime[h];
      var h1 = this.xtime[this.xtime[xh ^ s0 ^ s2]] ^ h;
      var h2 = this.xtime[this.xtime[xh ^ s1 ^ s3]] ^ h;
      state[i + 0] ^= h1 ^ this.xtime[s0 ^ s1];
      state[i + 1] ^= h2 ^ this.xtime[s1 ^ s2];
      state[i + 2] ^= h1 ^ this.xtime[s2 ^ s3];
      state[i + 3] ^= h2 ^ this.xtime[s3 ^ s0];
    }
  }
// xor the elements of two arrays together
  pidCrypt.AES.prototype.xOr_Array = function( a1, a2 ){
     var i;
     var res = Array();
     for( i=0; i<a1.length; i++ )
        res[i] = a1[i] ^ a2[i];

     return res;
  }
  pidCrypt.AES.prototype.getCounterBlock = function(){
    // initialise counter block (NIST SP800-38A §B.2): millisecond time-stamp for nonce in 1st 8 bytes,
    // block counter in 2nd 8 bytes
    var ctrBlk = new Array(this.blockSize);
    var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
    var nonceSec = Math.floor(nonce/1000);
    var nonceMs = nonce%1000;
    // encode nonce with seconds in 1st 4 bytes, and (repeated) ms part filling 2nd 4 bytes
    for (var i=0; i<4; i++) ctrBlk[i] = (nonceSec >>> i*8) & 0xff;
    for (var i=0; i<4; i++) ctrBlk[i+4] = nonceMs & 0xff;
    
   return ctrBlk.slice();
  }
}
/* pidCrypt/aes_cbc.js */
 /*----------------------------------------------------------------------------*/
 // Copyright (c) 2009 pidder <www.pidder.com>
 // Permission to use, copy, modify, and/or distribute this software for any
 // purpose with or without fee is hereby granted, provided that the above
 // copyright notice and this permission notice appear in all copies.
 //
 // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
/*----------------------------------------------------------------------------*/
/*
*  AES CBC (Cipher Block Chaining) Mode for use in pidCrypt Library
*  The pidCrypt AES CBC mode is compatible with openssl aes-xxx-cbc mode
*  using the same algorithms for key and iv creation and padding as openssl.
*
*  Depends on pidCrypt (pidcrypt.js, pidcrypt_util.js), AES (aes_core.js)
*  and MD5 (md5.js)
*
/*----------------------------------------------------------------------------*/

if(typeof(pidCrypt) != 'undefined' &&
   typeof(pidCrypt.AES) != 'undefined' &&
   typeof(pidCrypt.MD5) != 'undefined')
{
  pidCrypt.AES.CBC = function () {
    this.pidcrypt = new pidCrypt();
    this.aes = new pidCrypt.AES(this.pidcrypt);
    //shortcuts to pidcrypt methods
    this.getOutput = function(){
      return this.pidcrypt.getOutput();
    }
    this.getAllMessages = function(lnbrk){
      return this.pidcrypt.getAllMessages(lnbrk);
    }
    this.isError = function(){
      return this.pidcrypt.isError();
    }
  }
/**
* Initialize CBC for encryption from password.
* Note: Only for encrypt operation!
* @param  password: String
* @param  options {
*           nBits: aes bit size (128, 192 or 256)
*         }
*/
  pidCrypt.AES.CBC.prototype.init = function(password, options) {
    if(!options) options = {};
    var pidcrypt = this.pidcrypt;
    pidcrypt.setDefaults();
    var pObj = this.pidcrypt.getParams(); //loading defaults
    for(var o in options)
      pObj[o] = options[o];
    var k_iv = this.createKeyAndIv({password:password, salt: pObj.salt, bits: pObj.nBits});
    pObj.key = k_iv.key;
    pObj.iv = k_iv.iv;
    pObj.dataOut = '';
    pidcrypt.setParams(pObj)
    this.aes.init();
  }

/**
* Initialize CBC for encryption from password.
* @param  dataIn: plain text
* @param  password: String
* @param  options {
*           nBits: aes bit size (128, 192 or 256)
*         }
*/
  pidCrypt.AES.CBC.prototype.initEncrypt = function(dataIn, password, options) {
    this.init(password,options);//call standard init
    this.pidcrypt.setParams({dataIn:dataIn, encryptIn: pidCryptUtil.toByteArray(dataIn)})//setting input for encryption
  }
/**
* Initialize CBC for decryption from encrypted text (compatible with openssl).
* see thread http://thedotnet.com/nntp/300307/showpost.aspx
* @param  crypted: base64 encoded aes encrypted text
* @param  passwd: String
* @param  options {
*           nBits: aes bit size (128, 192 or 256),
*           UTF8: boolean, set to false when decrypting certificates,
*           A0_PAD: boolean, set to false when decrypting certificates
*         }
*/
  pidCrypt.AES.CBC.prototype.initDecrypt = function(crypted, password, options){
    if(!options) options = {};
    var pidcrypt = this.pidcrypt;
    pidcrypt.setParams({dataIn:crypted})
    if(!password)
      pidcrypt.appendError('pidCrypt.AES.CBC.initFromEncryption: Sorry, can not crypt or decrypt without password.n');
    var ciphertext = pidCryptUtil.decodeBase64(crypted);
    if(ciphertext.indexOf('Salted__') != 0)
      pidcrypt.appendError('pidCrypt.AES.CBC.initFromCrypt: Sorry, unknown encryption method.n');
    var salt = ciphertext.substr(8,8);//extract salt from crypted text
    options.salt = pidCryptUtil.convertToHex(salt);//salt is always hex string
    this.init(password,options);//call standard init
    ciphertext = ciphertext.substr(16);
    pidcrypt.setParams({decryptIn:pidCryptUtil.toByteArray(ciphertext)})
  }
/**
* Init CBC En-/Decryption from given parameters.
* @param  input: plain text or base64 encrypted text
* @param  key: HEX String (16, 24 or 32 byte)
* @param  iv: HEX String (16 byte)
* @param  options {
*           salt: array of bytes (8 byte),
*           nBits: aes bit size (128, 192 or 256)
*         }
*/
  pidCrypt.AES.CBC.prototype.initByValues = function(dataIn, key, iv, options){
    var pObj = {};
    this.init('',options);//empty password, we are setting key, iv manually
    pObj.dataIn = dataIn;
    pObj.key = key
    pObj.iv = iv
    this.pidcrypt.setParams(pObj)
  }

  pidCrypt.AES.CBC.prototype.getAllMessages = function(lnbrk){
    return this.pidcrypt.getAllMessages(lnbrk);
  }
/**
* Creates key of length nBits and an iv form password+salt
* compatible to openssl.
* See thread http://thedotnet.com/nntp/300307/showpost.aspx
*
* @param  pObj {
*    password: password as String
*    [salt]: salt as String, default 8 byte random salt
*    [bits]: no of bits, default pidCrypt.params.nBits = 256
* }
*
* @return         {iv: HEX String, key: HEX String}
*/
  pidCrypt.AES.CBC.prototype.createKeyAndIv = function(pObj){
    var pidcrypt = this.pidcrypt;
    var retObj = {};
    var count = 1;//openssl rounds
    var miter = "3";
    if(!pObj) pObj = {};
    if(!pObj.salt) {
      pObj.salt = pidcrypt.getRandomBytes(8);
      pObj.salt = pidCryptUtil.convertToHex(pidCryptUtil.byteArray2String(pObj.salt));
      pidcrypt.setParams({salt: pObj.salt});
    }
    var data00 = pObj.password + pidCryptUtil.convertFromHex(pObj.salt);
    var hashtarget = '';
    var result = '';
    var keymaterial = [];
    var loop = 0;
    keymaterial[loop++] = data00;
    for(var j=0; j<miter; j++){
      if(j == 0)
        result = data00;   	//initialize
      else {
        hashtarget = pidCryptUtil.convertFromHex(result);
        hashtarget += data00;
        result = hashtarget;
      }
      for(var c=0; c<count; c++){
        result = pidCrypt.MD5(result);
      }
      keymaterial[loop++] = result;
    }
    switch(pObj.bits){
      case 128://128 bit
        retObj.key = keymaterial[1];
        retObj.iv = keymaterial[2];
        break;
      case 192://192 bit
        retObj.key = keymaterial[1] + keymaterial[2].substr(0,16);
        retObj.iv = keymaterial[3];
        break;
      case 256://256 bit
        retObj.key = keymaterial[1] + keymaterial[2];
        retObj.iv = keymaterial[3];
        break;
       default:
         pidcrypt.appendError('pidCrypt.AES.CBC.createKeyAndIv: Sorry, only 128, 192 and 256 bits are supported.nBits('+typeof(pObj.bits)+') = '+pObj.bits);
    }
    return retObj;
  }
/**
* Encrypt a text using AES encryption in CBC mode of operation
*  - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
*
* one of the pidCrypt.AES.CBC init funtions must be called before execution
*
* @param  byteArray: text to encrypt as array of bytes
*
* @return aes-cbc encrypted text
*/
  pidCrypt.AES.CBC.prototype.encryptRaw = function(byteArray) {
    var pidcrypt = this.pidcrypt;
    var aes = this.aes;
    var p = pidcrypt.getParams(); //get parameters for operation set by init
    if(!byteArray)
      byteArray = p.encryptIn;
    pidcrypt.setParams({encryptIn: byteArray});
    if(!p.dataIn) pidcrypt.setParams({dataIn:byteArray});
    var iv = pidCryptUtil.convertFromHex(p.iv);
    //PKCS5 paddding
    var charDiv = p.blockSize - ((byteArray.length+1) % p.blockSize);
    if(p.A0_PAD)
      byteArray[byteArray.length] = 10
    for(var c=0;c<charDiv;c++) byteArray[byteArray.length] = charDiv;
    var nBytes = Math.floor(p.nBits/8);  // nr of bytes in key
    var keyBytes = new Array(nBytes);
    var key = pidCryptUtil.convertFromHex(p.key);
    for (var i=0; i<nBytes; i++) {
      keyBytes[i] = isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
    }
    // generate key schedule
    var keySchedule = aes.expandKey(keyBytes);
    var blockCount = Math.ceil(byteArray.length/p.blockSize);
    var ciphertxt = new Array(blockCount);  // ciphertext as array of strings
    var textBlock = [];
    var state = pidCryptUtil.toByteArray(iv);
    for (var b=0; b<blockCount; b++) {
      // XOR last block and next data block, then encrypt that
      textBlock = byteArray.slice(b*p.blockSize, b*p.blockSize+p.blockSize);
      state = aes.xOr_Array(state, textBlock);
      state = aes.encrypt(state.slice(), keySchedule);  // -- encrypt block --
      ciphertxt[b] = pidCryptUtil.byteArray2String(state);
    }
    var ciphertext = ciphertxt.join('');
    pidcrypt.setParams({dataOut:ciphertext, encryptOut:ciphertext});

    //remove all parameters from enviroment for more security is debug off
    if(!pidcrypt.isDebug() && pidcrypt.clear) pidcrypt.clearParams();
   return ciphertext || '';
  }


/**
* Encrypt a text using AES encryption in CBC mode of operation
*  - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
*
* Unicode multi-byte character safe
*
* one of the pidCrypt.AES.CBC init funtions must be called before execution
*
* @param  plaintext: text to encrypt
*
* @return aes-cbc encrypted text openssl compatible
*/
 pidCrypt.AES.CBC.prototype.encrypt = function(plaintext) {
    var pidcrypt = this.pidcrypt;
    var salt = '';
    var p = pidcrypt.getParams(); //get parameters for operation set by init
    if(!plaintext)
      plaintext = p.dataIn;
    if(p.UTF8)
      plaintext = pidCryptUtil.encodeUTF8(plaintext);
    pidcrypt.setParams({dataIn:plaintext, encryptIn: pidCryptUtil.toByteArray(plaintext)});
    var ciphertext = this.encryptRaw()
    salt = 'Salted__' + pidCryptUtil.convertFromHex(p.salt);
    ciphertext = salt  + ciphertext;
    ciphertext = pidCryptUtil.encodeBase64(ciphertext);  // encode in base64
    pidcrypt.setParams({dataOut:ciphertext});
    //remove all parameters from enviroment for more security is debug off
    if(!pidcrypt.isDebug() && pidcrypt.clear) pidcrypt.clearParams();

    return ciphertext || '';
  }

/**
* Encrypt a text using AES encryption in CBC mode of operation
*  - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf
*
* Unicode multi-byte character safe
*
* @param  dataIn: plain text
* @param  password: String
* @param  options {
*           nBits: aes bit size (128, 192 or 256)
*         }
*
* @param  plaintext: text to encrypt
*
* @return aes-cbc encrypted text openssl compatible
*
*/
  pidCrypt.AES.CBC.prototype.encryptText = function(dataIn,password,options) {
   this.initEncrypt(dataIn, password, options);
   return this.encrypt();
  }



/**
* Decrypt a text encrypted by AES in CBC mode of operation
*
* one of the pidCrypt.AES.CBC init funtions must be called before execution
*
* @param  byteArray: aes-cbc encrypted text as array of bytes
* 
* @return           decrypted text as String
*/
pidCrypt.AES.CBC.prototype.decryptRaw = function(byteArray) {
    var aes = this.aes;
    var pidcrypt = this.pidcrypt;
    var p = pidcrypt.getParams(); //get parameters for operation set by init
    if(!byteArray)
      byteArray = p.decryptIn;
    pidcrypt.setParams({decryptIn: byteArray});
    if(!p.dataIn) pidcrypt.setParams({dataIn:byteArray});
    if((p.iv.length/2)<p.blockSize)
      return pidcrypt.appendError('pidCrypt.AES.CBC.decrypt: Sorry, can not decrypt without complete set of parameters.n Length of key,iv:'+p.key.length+','+p.iv.length);
    var iv = pidCryptUtil.convertFromHex(p.iv);
    if(byteArray.length%p.blockSize != 0)
      return pidcrypt.appendError('pidCrypt.AES.CBC.decrypt: Sorry, the encrypted text has the wrong length for aes-cbc moden Length of ciphertext:'+byteArray.length+byteArray.length%p.blockSize);
    var nBytes = Math.floor(p.nBits/8);  // nr of bytes in key
    var keyBytes = new Array(nBytes);
    var key = pidCryptUtil.convertFromHex(p.key);
    for (var i=0; i<nBytes; i++) {
      keyBytes[i] = isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i);
    }
    // generate key schedule
    var keySchedule = aes.expandKey(keyBytes);
    // separate byteArray into blocks
    var nBlocks = Math.ceil((byteArray.length) / p.blockSize);
    // plaintext will get generated block-by-block into array of block-length strings
    var plaintxt = new Array(nBlocks.length);
    var state = pidCryptUtil.toByteArray(iv);
    var ciphertextBlock = [];
    var dec_state = [];
    for (var b=0; b<nBlocks; b++) {
      ciphertextBlock = byteArray.slice(b*p.blockSize, b*p.blockSize+p.blockSize);
      dec_state = aes.decrypt(ciphertextBlock, keySchedule);  // decrypt ciphertext block
      plaintxt[b] = pidCryptUtil.byteArray2String(aes.xOr_Array(state, dec_state));
      state = ciphertextBlock.slice(); //save old ciphertext for next round
    }
    
    // join array of blocks into single plaintext string and return it
    var plaintext = plaintxt.join('');
    if(pidcrypt.isDebug()) pidcrypt.appendDebug('Padding after decryption:'+ pidCryptUtil.convertToHex(plaintext) + ':' + plaintext.length + 'n');
    var endByte = plaintext.charCodeAt(plaintext.length-1);
    //remove oppenssl A0 padding eg. 0A05050505
    if(p.A0_PAD){
        plaintext = plaintext.substr(0,plaintext.length-(endByte+1));
    }
    else {
      var div = plaintext.length - (plaintext.length-endByte);
      var firstPadByte = plaintext.charCodeAt(plaintext.length-endByte);
      if(endByte == firstPadByte && endByte == div)
        plaintext = plaintext.substr(0,plaintext.length-endByte);
    }
    pidcrypt.setParams({dataOut: plaintext,decryptOut: plaintext});

    //remove all parameters from enviroment for more security is debug off
    if(!pidcrypt.isDebug() && pidcrypt.clear) pidcrypt.clearParams();

   return plaintext || '';
  }

/**
* Decrypt a base64 encoded text encrypted by AES in CBC mode of operation
* and removes padding from decrypted text
*
* one of the pidCrypt.AES.CBC init funtions must be called before execution
*
* @param  ciphertext: base64 encoded and aes-cbc encrypted text
*
* @return           decrypted text as String
*/
  pidCrypt.AES.CBC.prototype.decrypt = function(ciphertext) {
    var pidcrypt = this.pidcrypt;
    var p = pidcrypt.getParams(); //get parameters for operation set by init
    if(ciphertext)
      pidcrypt.setParams({dataIn:ciphertext});
    if(!p.decryptIn) {
      var decryptIn = pidCryptUtil.decodeBase64(p.dataIn);
      if(decryptIn.indexOf('Salted__') == 0) decryptIn = decryptIn.substr(16);
      pidcrypt.setParams({decryptIn: pidCryptUtil.toByteArray(decryptIn)});
    }
    var plaintext = this.decryptRaw();
    if(p.UTF8)
      plaintext = pidCryptUtil.decodeUTF8(plaintext);  // decode from UTF8 back to Unicode multi-byte chars
    if(pidcrypt.isDebug()) pidcrypt.appendDebug('Removed Padding after decryption:'+ pidCryptUtil.convertToHex(plaintext) + ':' + plaintext.length + 'n');
    pidcrypt.setParams({dataOut:plaintext});

    //remove all parameters from enviroment for more security is debug off
    if(!pidcrypt.isDebug() && pidcrypt.clear) pidcrypt.clearParams();
    return plaintext || '';
  }

/**
* Decrypt a base64 encoded text encrypted by AES in CBC mode of operation
* and removes padding from decrypted text
*
* one of the pidCrypt.AES.CBC init funtions must be called before execution
*
* @param  dataIn: base64 encoded aes encrypted text
* @param  password: String
* @param  options {
*           nBits: aes bit size (128, 192 or 256),
*           UTF8: boolean, set to false when decrypting certificates,
*           A0_PAD: boolean, set to false when decrypting certificates
*         }
*
* @return           decrypted text as String
*/
   pidCrypt.AES.CBC.prototype.decryptText = function(dataIn, password, options) {
     this.initDecrypt(dataIn, password, options);
     return this.decrypt();
   }

}


	var b = {
		decrypt: function(key, block) {
			return pidCrypt.AES.CBC.decryptText(block, key, { nBits: 128 });
		},

		encrypt: function(key, block) {
			return pidCrypt.AES.CBC.encryptText(block, key, { nBits: 128 });
		},

		sha: function(text) {
			return pidCrypt.SHA1(text);
		},

		randomKey: function(callback) {
			var index = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var key = '';
			for( var i = 1; i < 25; i++ ) { key += index[Math.floor( Math.random() * index.length )] };
			callback(key);
		},
	};

	if (!window.crypto_backends) window.crypto_backends = {};
	window.crypto_backends['PIDCRYPT'] = b;
	if (!window.ezcrypt_backend) window.ezcrypt_backend = b;
})();
