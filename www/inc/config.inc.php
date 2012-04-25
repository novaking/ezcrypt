<?php

	include_once dirname( __FILE__ ) . '/functions.inc.php';

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

	function get_config() { global $__config; return $__config; }
	
	$__db = null;
	
	function get_db()
	{
		global $__db;
		
		if( $__db !== null ) return $__db;
		
		$conf = get_config();
		
		// connect to database
		$__db = new mysqli( $conf['database']['host'], $conf['database']['username'], $conf['database']['password'], $conf['database']['db'] );
		
		if( mysqli_connect_error() )
		{
			die( 'Unable to connect to db node server' );
		}
		
		$__db->query( 'SET NAMES utf32;' );
		
		return $__db;
	}
	