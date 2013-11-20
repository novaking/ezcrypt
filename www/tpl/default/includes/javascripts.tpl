<?php
	switch ( !empty( $pastes ) ? $pastes->get_crypto() : '' ) {
	case 'PIDCRYPT':
	case 'AES-128-CBC':
		$cryptolib = 'pidcrypt-dc66c5af697700ff68da533b35222097be70efc4.min.js';
		$format = 'AES-128-CBC';
		break;
	case 'CRYPTO_JS':
	case 'AES-256-OFB':
	default:
		$cryptolib = 'sjcl-9201e35dcd4c80b9b60379b45e41ad668ffe2f95.min.js';
		// $cryptolib = 'crypto-js-388cf47bbbca12de0b5671849efd604a6f5fa5aa.min.js';
		$format = 'AES-256-OFB';
		break;
	}
?>
<script type="text/javascript" src="<?=$site_url?>jslibs/head-1.0.2-1.min.js"></script>
<script type="text/javascript">
	window.ezcrypt_format = '<?=$format?>';
	head.load("jslibs/crypto-backends/<?=$cryptolib?>");
	head.load(
		"jslibs/jquery-1.7.1.min.js",
		"jslibs/jquery.textchange.min.js",
		"jslibs/codemirror/codemirror.min.js",
		"jslibs/codemirror/mode/combined.min.js",
		"jslibs/core-0.4-1.min.js"
	);
</script>
