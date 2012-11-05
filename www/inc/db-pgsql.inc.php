<?php

	function db_backend_connection()
	{
		$conf = get_config();

		// connect to database
		$db = pg_connect($conf['database']['connect'])
			or die('Unable to connect to db node server');

		if (pg_connection_status($db) !== PGSQL_CONNECTION_OK) {
			die('db: Bad connection status');
		}

		return $db;
	}

	function db_backend_get($db, $id)
	{
		// grab paste from database
		$sql = '
			SELECT
				*, (EXTRACT(EPOCH FROM now()) - added ) as age
			FROM
				pastes
			WHERE
				id = $1
			LIMIT
				1
			';

		$res = pg_query_params($db, $sql, array($id))  or die("Failed to execute query '$sql'");

		return pg_fetch_assoc($res);
	}

	function db_backend_add($db, $data, $syntax, $ttl, $password)
	{
		$sql = '
			INSERT INTO
				pastes
			( "data", "syntax", "added", "ttl", "password", "crypto" )
			VALUES
				( $1,  $2, EXTRACT(EPOCH FROM now()), $3, $4, $5 )
			RETURNING id
		';

		$res = pg_query_params($db, $sql, array($data, $syntax, $ttl, $password, 'CRYPTO_JS'))  or die("Failed to execute query '$sql'");

		$row = pg_fetch_row($res);
		return $row[0];
	}

	function db_backend_delete($db, $id)
	{
		$sql = '
			DELETE FROM
				pastes
			WHERE
				id = $1
		';

		$res = pg_query_params($db, $sql, array($id))  or die("Failed to execute query '$sql'");
	}
