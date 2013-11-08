<?php

	require_once dirname( __FILE__ ) . '/functions.inc.php';
	require_once dirname( __FILE__ ) . '/db.inc.php';

	$__config = array( 
		'domain' => $_SERVER['SERVER_NAME'],
		'ip' => $_SERVER['SERVER_ADDR'],
	
		'database' => array(
			'host' => 'localhost',
			'username' => 'username',
			'password' => 'password',
			'db' => 'ezcrypt',
		),
		
		'paste' => array(
			'secret' => '', // set this if you want unidentifiable alphaIds (not really secure)
		),

		'site' => array(
			'url' => '/',
			'source' => 'https://github.com/novaking/ezcrypt',
			'contact' => 'mailto:contact@ezcrypt.it',
		),

		'scripturl' => 'https://ezcrypt.it',
		// 'scripturl' => ( isset( $_SERVER['HTTPS'] ) ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'],
	);
	$year = gmdate('Y');
	$__config['site']['footer'] = <<<EOD
		$year EZCrypt.it
		<span class="small">&nbsp;&diams;&nbsp;</span>
		<a href="mailto:contact@ezcrypt.it">Contact</a>
EOD;

	if (file_exists(dirname( __FILE__ ) . '/config-local.inc.php'))
	{
		require_once dirname( __FILE__ ) . '/config-local.inc.php';
	}

	function get_config() { global $__config; return $__config; }
