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
		$cryptolib = 'sjcl-a4950fcca4b4f1050c822e846f8b63a248b3e54a.min.js';
		// $cryptolib = 'crypto-js-388cf47bbbca12de0b5671849efd604a6f5fa5aa.min.js';
		$format = 'AES-256-OFB';
		break;
	}
?>
<script type="text/javascript" src="<?=$site_url?>jslibs/head-1.0.1.min.js"></script>
<script type="text/javascript">
	window.ezcrypt_format = '<?=$format?>';
	head.load("jslibs/crypto-backends/<?=$cryptolib?>");
	head.load(
		"jslibs/jquery-1.7.1.min.js",
		"jslibs/jquery.textchange.min.js",
		"jslibs/codemirror/codemirror.min.js",
		"jslibs/codemirror/mode/combined.min.js",
		"jslibs/ezcrypt.js",
		"jslibs/core.js"
	);
</script>
