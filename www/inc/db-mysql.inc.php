<?php

	function db_backend_connection()
	{
		$conf = get_config();

		// connect to database
		$db = new mysqli( $conf['database']['host'], $conf['database']['username'], $conf['database']['password'], $conf['database']['db'] );

		if( mysqli_connect_error() )
		{
			die( 'Unable to connect to db node server' );
		}

		$db->query( 'SET NAMES utf32;' );

		return $db;
	}

	function db_backend_get($db, $id)
	{
		// grab paste from database
		$sql = '
			SELECT
				*, ( UNIX_TIMESTAMP() - added ) as age
			FROM
				pastes
			WHERE
				id = ?
			LIMIT
				1
			';

		$stmt = $db->prepare($sql);
		$stmt->bind_param('i', $id);
		$stmt->execute();

		$res = $stmt->get_result();

		return $res->fetch_array(MYSQLI_ASSOC);
	}

	function db_backend_add($db, $data, $syntax, $ttl, $password)
	{
		$sql = '
			INSERT INTO
				pastes
			( `data`, `syntax`, `added`, `ttl`, `password`, `crypto` )
			VALUES
				( ?,  ?, UNIX_TIMESTAMP(), ?, ?, ? )
		';

		$stmt = $db->prepare($sql);
		$crypto = 'CRYPTO_JS';
		$stmt->bind_param('ssiss', $data, $syntax, $ttl, $password, $crypto);
		$stmt->execute();
		$stmt->close();

		return $db->insert_id;
	}

	function db_backend_delete($db, $id)
	{
		$sql = '
			DELETE FROM
				pastes
			WHERE
				id = ?
		';

		$stmt = $db->prepare($sql);
		$stmt->bind_param( 'i', $id );
		$stmt->execute();
	}
