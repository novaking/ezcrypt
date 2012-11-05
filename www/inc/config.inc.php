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
			'secret' => '', // set this if you want unidentifiable alphaIds
		)
	);

	if (file_exists(dirname( __FILE__ ) . '/config-local.inc.php'))
	{
		require_once dirname( __FILE__ ) . '/config-local.inc.php';
	}

	function get_config() { global $__config; return $__config; }
