<?php

	$__db = null;

	function db_connection()
	{
		global $__db;

		if( $__db !== null ) return $__db;

		$conf = get_config();

		if (empty($conf['database']['type']) || 'mysql' == $conf['database']['type'])
		{
			require_once dirname( __FILE__ ) . '/db-mysql.inc.php';
		}
		else if ('pgsql' == $conf['database']['type'])
		{
			require_once dirname( __FILE__ ) . '/db-pgsql.inc.php';
		}

		$__db = db_backend_connection();

		return $__db;
	}

	// returns assoc array with additional entry age => time() - added
	function db_get($id)
	{
		$db = db_connection();

		return db_backend_get($db, (int) $id);
	}

	function db_add($data, $syntax, $ttl, $password = null)
	{
		$db = db_connection();

		return db_backend_add($db, $data, $syntax, $ttl, $password);
	}

	function db_delete($id)
	{
		$db = db_connection();

		return db_backend_delete($db, (int) $id);
	}
