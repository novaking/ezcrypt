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
		private $id;
		
		function get( $id )
		{
			$this->id = alphaID( $id, true );

			if (false !== ( $paste = db_get( $this->id ) ))
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
			if (!empty($password)) {
				// create a salt that ensures crypt creates an md5 hash
				$base64_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
				$salt = '$5$';
				for($i=0; $i<16; $i++) $salt .= $base64_alphabet[rand(0,63)];
				$salt .= '$';
				$password = crypt($password, $salt);
			}

			// submit new paste to server
			return db_add($data, $syntax, $ttl, $password);
		}
		
		function validate_password( $password )
		{
			// if we haven't gotten a paste yet.
			if( empty( $this->paste ) ) return EZCRYPT_MISSING_DATA;

			if (!empty($this->paste['password']))
			{
				if (empty($password))
				{
					// prompt user for password
					return EZCRYPT_PASSWORD_REQUIRED;
				}

				if (strlen($this->paste['password']) == 40 && '$' != $this->paste['password'][0])
				{
					// old style, salted with id
					$password = sha1($this->paste['id'] . $password);
				}
				else
				{
					// crypted
					$password = crypt($password, $this->paste['password']);
				}

				if (0 == strcmp($password, $this->paste['password']))
				{
					// correct, send user the required data
					return EZCRYPT_PASSWORD_SUCCESS;
				}

				// incorrect, give the json response an error
				return EZCRYPT_PASSWORD_FAILED;
			}

			return EZCRYPT_NO_PASSWORD;
		}
		
		function has_expired()
		{
			// if we haven't gotten a paste yet.
			if( empty( $this->paste ) ) return EZCRYPT_MISSING_DATA;
			
			// determine if the paste has expired.
			// if ttl is set to -1 that means it a perm paste
			// if ttl is set to -100 that means this is a one-time only paste
			// otherwise test to see if the ttl duration has been met
			if ( -100 == $this->paste['ttl'] )
			{
				// one-time only paste, delete it now
				db_delete($this->id);
			}
			else if( $this->paste['ttl'] != -1 && $this->paste['age'] > $this->paste['ttl'] )
			{
				// this paste is flagged as expired, time to clean up
				db_delete($this->id);
				unset( $this->paste ); // cleanup
				return EZCRYPT_HAS_EXPIRED;
			}
			
			return false;
		}
		
		function get_crypto()
		{
			// default to crypto-js 
			if( empty( $this->paste ) ) { return 'CRYPTO_JS'; }
			
			// return the type of crypto that was used for the paste
			return $this->paste['crypto'];
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