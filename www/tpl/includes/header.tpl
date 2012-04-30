<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><?=$meta_title;?></title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<meta name="robots" content="noarchive" />
		<meta name="googlebot" content="nosnippet" />
		<meta name="googlebot" content="noarchive" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="pragma" content="no-cache" />
		<link rel="stylesheet" href="/css/styles.min.css" />
		<link rel="shortcut icon" href="/favicon.ico" />
		
		<!--[if gte IE 9]>
		<style type="text/css">
			.gradient { filter: none !important; }
		</style>
		<![endif]-->
	
		<script type="text/javascript">
			var lib = '<?php echo ( !empty( $pastes ) ) ? $pastes->get_crypto() : 'CRYPTO_JS'; ?>';
			
			// holder object to store jquery commands until jquery is loaded up
			window.$ = ( function() {
				var q = [], f = function( cb ) {
					q.push( cb );
				};
				f.attachReady = function( $ ) { 
					$( function () {
						$.each( q, function( i, f ) {
							f.call( document );
						} );
						q.length = 0;
					} );
					return $;
				}
				return f;
			} )();
		</script>
		<script type="text/javascript" src="/inc/jslibs/LAB.min.js"></script>
		<script type="text/javascript" src="/inc/jslibs/core-0.4.min.js"></script>
	</head>
	<body>
		<div id="holder">
			<div id="header" class="gradient">
				EZCrypt <span class="small">v0.4</span> - Giving you the power to encrypt your information
			</div>
			<div id="menu">
				<a href="/">Home</a>
				<span class="small">&nbsp;</span>
				<a href="/about">About</a>
				<span class="small">&nbsp;</span>
				<a href="mailto:contact@ezcrypt.it">Contact</a>
				<span class="small">&nbsp;</span>
				<a href="https://github.com/novaking/ezcrypt" target="_blank">Sourcecode</a>
			</div>
			<div id="main">