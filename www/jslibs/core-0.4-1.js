/**
 * EZCrypt core code
 * 
 * @version: 0.4
 * @author: NovaKing (novaking@eztv.se)
 * @version: 0.4-1
 * @author: Stefan Bühler
 * 
 * General functions that get used within the website
 * 
 **/


$( function() {
	var editor; // syntax highlighter
	var _encrypting = null; // used as flag state to determine if encryption is in mid-progress

	var __timer_decryption; // time taken to decrypt
	var __timer_encryption; // time taken to encrypt
	var __timer_coloring; // time taken to color syntax
	var __timer_total; // total time taken

	// simply class to calculate time difference
	var timeDiff = {
		time: undefined,
		setStartTime: function () {
			var d = new Date();
			this.time = d.getTime();
		},

		getDiff: function () {
			var d = new Date();
			return d.getTime() - this.time;
		}
	};

	// break up the string every nth character
	function stringBreak( str, col )
	{
		var result = '';
		for( var i = 0; i < str.length; i++ )
		{
			result += str.charAt( i );
			if ( ( ( i + 1 ) % col == 0 ) && ( 0 < i ) )
			{
				result += "\n";
			}
		}
		return result;
	}

	// hover effect when moving mouse over submit button
	function enableHover()
	{
		$( '#en' ).hover(
			function() {
				$( '#result' ).show();
				$( '#encrypttime' ).show();
			},
			function() {
				$( '#result' ).hide();
				$( '#encrypttime' ).hide();
			}
		);
	}

	// determine duration taken to render the syntax highlighter
	function onCodeChange( /* ed, obj */ )
	{
		__timer_coloring = timeDiff.getDiff();
		// display duration
		$( '#coloring' ).html( 'syntax: ' + __timer_coloring + 'ms,');
		
		// if we have hit this point it means we have finished, display total time taken
		__timer_total = ( __timer_decryption + __timer_coloring );
		$( '#totaltime' ).html( 'total: ' + __timer_total + 'ms');
	}

	// simple function wrapper to decryption time can be logged
	function decrypt( key, data )
	{
		// display decrypt buffering image..
		$( '#decrypting' ).show();
		// hide key field
		$( '#insertkey' ).hide();
		// start timer and decrypt
		timeDiff.setStartTime();
		var output = window.ezcrypt_backend.decrypt( key, data );
		__timer_decryption = timeDiff.getDiff();
		
		timeDiff.setStartTime(); // reset timer

		$( '#wrapholder' ).show();
		// display duration
		$( '#execute' ).html( 'decryption: ' + __timer_decryption + 'ms,');
		$( '.cm-s-default' ).parent().show();
		$( '#decrypting' ).hide();
		return output;
	}

	// simple function wrapper to encryption
	// @todo: add timestamp on encrypting?
	function encrypt( key, data )
	{
		// start timer and encrypt
		timeDiff.setStartTime();
		var encrypt = stringBreak( window.ezcrypt_backend.encrypt( key, data ), 96 );
		__timer_encryption = timeDiff.getDiff();
		$( '#encrypttime' ).html( 'encryption: ' + __timer_encryption + 'ms');
		return encrypt;
	}

	// when a password is assigned to a paste
	// the page doesn't get the encrypted data until your supply the correct password
	// this function handles the ajax calling to validate the password and return the data
	function requestData()
	{
		var password = window.ezcrypt_backend.sha( $( '#typepassword' ).val() );
		var url = window.location.href;
		var hash = window.location.hash;
		var index_of_hash = url.indexOf( hash ) || url.length;
		var hashless_url = url.substr( 0, index_of_hash );

		$.ajax( {
			url: hashless_url,
			type: 'POST',
			dataType: 'json',
			data: 'p=' + password,
			cache: false,
			success: function( json ) {
				// success, assign the data accordingly
				$( '#data' ).val( json.data );
				$( '#syntax' ).val( json.syntax );
				editor.setOption( 'mode', $( '#syntax' ).val() );
				if( hash == '' )
				{
					// if no hash in the url, we prompt the user to enter it
					$( '#askpassword' ).hide();
					$( '#insertkey' ).show();
					$( '#typekey' ).focus();
				}
				else
				{
					// decrypt our data
					$( '#askpassword' ).hide();
					editor.setValue( decrypt( hash.substring( 1 ), $( '#data' ).val() ) );
				}
			},
			error: function() {
				alert( 'bad password!' );
			}
		} );
	}

	function submitData()
	{
		if( $( '#text' ).val() == '' )
		{
			return false; // don't submit if blank form
		}

		if( _encrypting != null )
		{
			// stop delayed encryption timer, force re-encrypt now by emptying #result
			clearTimeout(_encrypting);
			_encrypting = null;
			$( '#result' ).val('')
		}

		if( $( '#result' ).val() == '' )
		{
			$( '#result' ).val( encrypt( $( '#key' ).val(), $( '#text' ).val() ) );
		}

		$( '#en' ).unbind( 'mouseenter mouseleave' );
		$( '#result' ).show();
		$( '#encrypttime' ).show();

		// make data post friendly
		var data = $( '#result' ).val();
		data = encodeURIComponent( data );
		var password = '';
		if( $( '#usepassword' ).is( ':checked' ) )
		{
			// if password is used, let's sha the password before we send it over
			password = window.ezcrypt_backend.sha( $( '#typepassword' ).val() );
		}

		var ttl = $( '#ttl option:selected' ).val();
		var syntax = $( '#syntax option:selected' ).val();
		// if syntax is empty, try hidden element incase of clone feature
		if( typeof( syntax ) == 'undefined' ) { syntax = $( '#syntax' ).val(); }
		
		// send submission to server
		$.ajax( {
			url: document.baseURI,
			type: 'POST',
			dataType: 'json',
			data: '&data=' + data + '&p=' + password + '&ttl=' + ttl + '&syn=' + syntax,
			cache: false,
			success: function( json ) {
				if( ttl == -100 )
				{
					// special condition when it's a one-time only paste, we don't redirect the user as that would trigger the delete call
					// instead we simply mock the page and provide the url of the paste
					
				}
				else
				{
					var querypw = '';
					if (password != '') querypw = '?p=' + password;
					window.location = document.baseURI + 'p/' + json.id + querypw + '#' + $( '#key' ).val();
				}
			},
			error: function() {
				enableHover();
				alert( 'error submitting form' );
			}
		} );
	}


	if( document.getElementById( 'content' ) )
	{
		// load up our editor
		window.editor = editor = CodeMirror.fromTextArea( document.getElementById( 'content' ), {
			lineNumbers: true,
			matchBrackets: false,
			lineWrapping: false,
			readOnly: true,
			onChange: onCodeChange
		} );
		
		editor.setOption( 'mode', $( '#syntax' ).val() );
		editor.focus();
	}

	window.ezcrypt_backend.randomKey(function (key) {
		$( '#key' ).val( key );
		var en = $('#en');
		en.bind( 'click', submitData );
		en.removeAttr( 'disabled' );
		en.val( 'Submit' );

		// when we detect the text has changed we flag the encryption to trigger off 500ms afterwards
		// if more text gets entered the trigger will continue resetting as not to cause unwanted CPU usage
		$( '#text' ).bind( 'textchange', function() {
			if( _encrypting != null ) { clearTimeout( _encrypting ); _encrypting = null; }
			_encrypting = setTimeout( function() {
				$( '#result' ).val( encrypt( $( '#key' ).val(), $( '#text' ).val() ) );
				_encrypting = null;
			}, 500 );
		} );
	});

	// support ctrl+enter to send paste
	$( '#text' ).live( 'keydown', function( e ) { if( e.keyCode == 13 && e.ctrlKey ) { $( '#en' ).click(); } } );
	
	$( '#usepassword' ).change( function() { if( this.checked ) { $( '#typepassword' ).show(); } else { $( '#typepassword' ).hide(); } } );
	$( '#submitpassword' ).bind( 'click', requestData );

	$( '#new' ).bind( 'click', function() { $( '#text' ).html( '' ); $( '#result' ).val( '' ); $( '#newpaste' ).slideDown(); } );
	$( '#clone' ).bind( 'click', function() { $( '#text' ).html( editor.getValue() ).trigger( 'textchange' ); $( '#newpaste' ).slideDown(); } );
	 
	$( '#tool-wrap' ).bind( 'click', function() {
		var checked = $( '#tool-wrap' ).is( ':checked' );
		if( checked == 1 )
		{
			$( '.tool-wrap' ).addClass( 'tool-wrap-on' );
			editor.setOption( 'lineWrapping', true );
		}
		else
		{
			$( '.tool-wrap' ).removeClass( 'tool-wrap-on' );
			editor.setOption( 'lineWrapping', false );
		}
	} );
	$( '#tool-numbers' ).bind( 'click', function() {
		var checked = $( '#tool-numbers' ).is( ':checked' );
		if( checked == 1 )
		{
			$( '.tool-numbers' ).addClass( 'tool-numbers-on' );
			editor.setOption( 'lineNumbers', true );
		}
		else
		{
			$( '.tool-numbers' ).removeClass( 'tool-numbers-on' );
			editor.setOption( 'lineNumbers', false );
		}
	} );
	$( '#tool-fullscreen' ).bind( 'click', function() {
		var checked = $( '#tool-fullscreen' ).is( ':checked' );
		if( checked == 1 )
		{
			$( '.tool-fullscreen' ).addClass( 'tool-fullscreen-on' );
			$( '#holder' ).css( 'width', '100%' );
		}
		else
		{
			$( '.tool-fullscreen' ).removeClass( 'tool-fullscreen-on' );
			$( '#holder' ).css( 'width', '' );
		}
	} );

	enableHover();

	window.ezcrypt = {
		sha: window.ezcrypt_backend.sha,
		encrypt: encrypt,
		decrypt: decrypt,
		editor: editor,
		requestData: requestData
	}
} );
