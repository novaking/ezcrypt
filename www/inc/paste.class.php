<?php

	define( 'EZCRYPT_MISSING_DATA', -1 );
	define( 'EZCRYPT_DOES_NOT_EXIST', 1 );
	define( 'EZCRYPT_HAS_EXPIRED', 2 );
	
	define( 'EZCRYPT_NO_PASSWORD', 10 );
	define( 'EZCRYPT_PASSWORD_SUCCESS', 11 );
	define( 'EZCRYPT_PASSWORD_FAILED', 12 );
	define( 'EZCRYPT_PASSWORD_REQUIRED', 13 );
	
	/**
	 * Basic PHP based paste system
	 * 
	 * Allows getting and adding of pastes.
	 * Can check to see if a paste has expired, and prunes accordingly.
	 * Validates against password if one exists
	 * 
	 * @author NovaKing
	 * @version 0.4
	 **/
	class Paste
	{
		private $paste;
		private $db;
		private $id;
		
		function __construct()
		{
			$this->db = get_db();
		}
		
		function get( $id )
		{
			$this->id = alphaID( $id, true );
			
			// grab paste from database
			$sql = '
				SELECT
					*, ( UNIX_TIMESTAMP() - added ) as counter
				FROM
					pastes
				WHERE
					id = ?
				LIMIT
					1
			';
			
			$stmt = $this->db->prepare( $sql );
			$stmt->bind_param( 'i', $this->id );
			$stmt->execute();
			
			$res = $stmt->get_result();
			
			if( ( $paste = $res->fetch_array( MYSQLI_ASSOC ) ) !== false )
			{
				$this->paste = $paste; // assign to class variable
				
				// check to see if this paste has expired
				$expired = $this->has_expired();
				if( $expired === false )
				{
					return $this->paste;
				}
				
				return $expired;
			}
			
			return EZCRYPT_DOES_NOT_EXIST;
		}
		
		function add( $data, $syntax, $ttl, $password = null )
		{
			// submit new paste to server
			$sql = '
				INSERT INTO
					pastes
				( `data`, `syntax`, `added`, `ttl` )
				VALUES
					( ?,  ?, UNIX_TIMESTAMP(), ? )
			';
			
			$stmt = $this->db->prepare( $sql );
			$stmt->bind_param( 'ssi', $data, $syntax, $ttl );
			$stmt->execute();
			$stmt->close();
			
			$new_id = $this->db->insert_id;
			
			// if the user has set a password, we now apply it as we use the id as a simple salt
			$password = ( !empty( $password ) ) ? sha1( $new_id . $password ) : null;
			
			if( !empty( $password ) )
			{
				$sql = '
					UPDATE
						pastes
					SET
						password = ?
					WHERE
						id = ?
					LIMIT
						1
				';
				
				$stmt = $this->db->prepare( $sql );
				$stmt->bind_param( 'si', $password, $new_id );
				$stmt->execute();
				$stmt->close();
			}
			
			return $new_id;
		}
		
		function validate_password( $password )
		{
			// if we haven't gotten a paste yet.
			if( empty( $this->paste ) ) return EZCRYPT_MISSING_DATA;
			
			// the user has entered in a password, see if it is correct
			if( !empty( $this->paste['password'] ) && !empty( $password ) && strcmp( sha1( $this->paste['id'] . $password ), $this->paste['password'] ) === 0 )
			{
				// correct, send user the required data
				return EZCRYPT_PASSWORD_SUCCESS;
			}
			elseif( !empty( $this->paste['password'] ) && !empty( $password ) && strcmp( sha1( $this->paste['id'] . $password ), $this->paste['password'] ) !== 0 )
			{
				// incorrect, give the json response an error
				return EZCRYPT_PASSWORD_FAILED;
			}
			elseif( !empty( $this->paste['password'] ) )
			{
				// prompt user for password
				return EZCRYPT_PASSWORD_REQUIRED;
			}
			
			return EZCRYPT_NO_PASSWORD;
		}
		
		function has_expired()
		{
			// if we haven't gotten a paste yet.
			if( empty( $this->paste ) ) return EZCRYPT_MISSING_DATA;
			
			// determine if the paste has expired.
			// if ttl is set to -1 that means it a perm paste
			// otherwise test to see if the ttl duration has been met
			if( $this->paste['ttl'] != -1 && $this->paste['counter'] > $this->paste['ttl'] )
			{
				// this paste is flagged as expired, time to clean up
				$sql = '
					DELETE FROM
						pastes
					WHERE
						id = ?
					LIMIT
						1
				';
				
				$stmt = $this->db->prepare( $sql );
				$stmt->bind_param( 'i', $this->id );
				$stmt->execute();
				
				unset( $this->paste ); // cleanup
					
				return EZCRYPT_HAS_EXPIRED;
			}
			
			return false;
		}
		
		function selected_syntax( $syntax )
		{
			// determine if syntax is the one selected 
			if( empty( $this->paste ) )
			{
				if( $syntax == 'text/plain' ) return ' selected';
				return '';
			}
			
			if( $this->paste['syntax'] == $syntax ) return ' selected';
			
			return '';
		}
	}