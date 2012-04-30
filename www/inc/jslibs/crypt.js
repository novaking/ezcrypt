/**
 * Wrapper for crypto libraries
 * 
 * @version 0.4
 * @author NovaKing (novaking@eztv.se)
 * 
 * A simple wrapper object that allows lazy loading of different crypto classes
 * this will eventually allow you to load up any crypto class and the encrypt/decrypt/sha
 * functions should work right out of the box
 * 
 **/
( function( window, undefined ) {
	try { if( typeof( $LAB ) == 'undefined' ) { throw ''; } } catch( e ) { throw 'ezcrypt depends on $LAB!'; }
	
	if( typeof( ezcrypt ) == 'undefined' ) { ezcrypt = {}; }
	
	var window = window, document = window.document, navigator = window.navigator, location = window.location;
	
	ezcrypt = function( type, func ) {

		if( typeof( window.ez ) == 'object' ) { return window.ez; } // don't double load
		
		_this = this; // local scope
		
		_loaded = false; // used to determine if crypto library has been loaded
		_aesobj = null; // aes object if required by library
		_type = {}; // library type object
		
		/*
		 * Crypto libraries:
		 * - clipperz:      - (Is not completed, requires additional work)
		 * - crypto-js:     ✓
		 * - gibberish-aes: ✗
		 * - jsaes:         ✗
		 * - jscryptolib:   ✗
		 * - moveable-type: ✗
		 * - pidCrypt:      ✓
		 * - sjcl:          ✗
		 * - slowaes:       ✗
		 */
		libs = {
			ENCRYPT_TYPE: {
				'CLIPPERZ': {
					'lib': [
					    'inc/jslibs/clipperz/MochiKit/MochiKit.js',
						'inc/jslibs/clipperz/MochiKit/Base.js',
					    'inc/jslibs/clipperz/MochiKit/Logging.js',
					    'inc/jslibs/clipperz/JSON/json2.js',
					    'inc/jslibs/clipperz/YUI/Utils.js',
						'inc/jslibs/clipperz/Base.js',
						'inc/jslibs/clipperz/ByteArray.js',
						'inc/jslibs/clipperz/Crypto/SHA.js',
						'inc/jslibs/clipperz/Crypto/AES.js'
					],
					'load': '',
					'decrypt': {
						'func': 'Clipperz.Crypto.AES.decrypt',
						'params': {}
					},
					'encrypt': {
						'func': 'Clipperz.Crypto.AES.encrypt',
						'key': {
							'func': 'Clipperz.Crypto.SHA.sha256',
							'params': {
								'func': 'Clipperz.ByteArray'
							}
						},
						'block': 'Clipperz.ByteArray',
						'params': {}
					},
					'sha': 'Clipperz.Crypto.SHA.sha256'
				},
				'CRYPTO_JS': {
					'lib': [
					    'inc/jslibs/crypto-js/crypto/crypto.js',
					    'inc/jslibs/crypto-js/sha1/sha1.js',
					    'inc/jslibs/crypto-js/hmac/hmac.js',
					    'inc/jslibs/crypto-js/pbkdf2/pbkdf2.js',
					    'inc/jslibs/crypto-js/blockmodes/blockmodes.js',
					    'inc/jslibs/crypto-js/aes/aes.js'
					],
					'load': '',
					'decrypt': {
					    'func': 'Crypto.AES.decrypt',
					    'params': {}
					},
					'encrypt': {
					    'func': 'Crypto.AES.encrypt',
					    'params': {}
					},
					'sha': 'Crypto.SHA1'
				},
				'GIBBERISH_AES': {},
				'JSAES': {},
				'JSCRYPTOLIB': {},
				'MOVEABLE_TYPE': {},
				'PIDCRYPT': {
					'lib': [
						'inc/jslibs/pidCrypt/pidcrypt_util.js',
						'inc/jslibs/pidCrypt/pidcrypt.js',
						'inc/jslibs/pidCrypt/md5.js',
						'inc/jslibs/pidCrypt/aes_core.js',
						'inc/jslibs/pidCrypt/aes_cbc.js'
					],
					'load': 'pidCrypt.AES.CBC',
					'decrypt': {
					    'func': 'decryptText',
					    'params': { nBits: 128 }
					},
					'encrypt': {
					    'func': 'encryptText',
					    'params': { nBits: 128 }
					},
					'sha': 'pidCrypt.SHA1'
				},
				'SJCL': {},
				'SLOWAES': {},
			},
			
			// determine if a library type exists
			type: function( name ) {
				try
				{
					if( typeof( this.ENCRYPT_TYPE[name] ) != 'undefined' ) { return true; }
					
					throw '';
				}
				catch( e )
				{
					throw 'Invalid encryption type specified!';
				}
			},
			
			// get the library type
			get: function( name )
			{
				if( this.type( name ) == true )
				{
					return this.ENCRYPT_TYPE[name];
				}
			},
			
			// determine array length of library types
			length: function() {
				var l = 0;
				for( var enc in this.ENCRYPT_TYPE ) { if( this.ENCRYPT_TYPE.hasOwnProperty( enc ) ) { l++ } }
				return l;
			}
		};
		
		// prepare the context scope for a function
		prep = function( func, context )
		{
			var namespaces = func.split( '.' );
			for( var n = 0; n < namespaces.length; n++ )
			{
				if( typeof( context[namespaces[n]] ) == 'undefined' )
				{
					throw 'Unknown namespace: ' + namespaces[n];
				}
				context = context[namespaces[n]];
			}
			
			return context;
		};
		
		// load a new object and return it
		load = function( func, context )
		{
			try
			{
				var args = Array.prototype.slice.call( arguments, 2);
				context = _this.prep( func, context );
				
				return new context( args );
			}
			catch( e )
			{
				throw e;
			}
		};
		
		// call a function and return the results
		call = function( func, context )
		{
			try
			{
				var args = Array.prototype.slice.call( arguments, 2);
				context = _this.prep( func, context );
				
				return context.apply( _this, args );
			}
			catch( e )
			{
				throw e;
			}
		};
		
		aes = {
			encrypt: function( key, block ) {
				// if block is specified in the config, this means something needs to be done to the
				// block data first before passing it to the encrypt function.
				if( _type['encrypt']['block'] )
				{
					block = _this.load( _type['encrypt']['block'], window, block );
				}
				
				var result = '';
				if( _aesobj )
				{
					// if an aes object exists, call the function off it
					if( !jQuery.isEmptyObject( _type['encrypt']['params'] ) )
					{
						return _aesobj[_type['encrypt']['func']]( block, key, _type['encrypt']['params'] );
					}
					else
					{
						return _aesobj[_type['encrypt']['func']]( block, key );
					}
				}
				else
				{
					// otherwise we call the function from the window, allowing for namespace based functions
					if( !jQuery.isEmptyObject( _type['encrypt']['params'] ) )
					{
						return _this.call( _type['encrypt']['func'], window, block, key, _type['encrypt']['params'] );
					}
					else
					{
						return _this.call( _type['encrypt']['func'], window, block, key );
					}
				}
			},
			
			decrypt: function( key, block ) {
				try
				{
					block = block.replace( /\n/gm, '' );
					
					if( _aesobj )
					{
						// if an aes object exists, call the function off it
						if( !jQuery.isEmptyObject( _type['decrypt']['params'] ) )
						{
							return _aesobj[_type['decrypt']['func']]( block, key, _type['decrypt']['params'] );
						}
						else
						{
							return _aesobj[_type['decrypt']['func']]( block, key );
						}
					}
					else
					{
						// otherwise we call the function from the window, allowing for namespace based functions
						if( !jQuery.isEmptyObject( _type['decrypt']['params'] ) )
						{
							return _this.call( _type['decrypt']['func'], window, block, key, _type['decrypt']['params'] );
						}
						else
						{
							return _this.call( _type['decrypt']['func'], window, block, key );
						}
					}
				}
				catch( e )
				{
					// an error has occurred somewhere, print the error and backtrace
					console.log( e );
					console.trace();
				}
			}
		};
		
		sha = function( text ) {
			return _this.call( _this._type['sha'], window, text );
		};
		
		_type = _this.libs.get( 'CRYPTO_JS' ); // default to crypto-js
		if( typeof( type ) != 'undefined' && _this.libs.type( type ) == true ) { _type = _this.libs.get( type ); }
		
		// lazy load our required libraries
		$LAB
		.script( _type['lib'] )
		.wait( function() {
			_loaded = true;
			
			// only load up obj if it has been assigned
			if( _type['load'] ) { _aesobj = _this.load( _type['load'], window ); }
			
			// exec callback
			if( typeof( func ) == 'function' ) { func( _this ); }
		} );
		
		return _this;
	};
	
	// Expose ezcrypt to the global object
	window.ezcrypt = ezcrypt;
	
} )( window );