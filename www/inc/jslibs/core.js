/**
 * EZCrypt core code
 * 
 * @version: 0.4
 * @author: NovaKing (novaking@eztv.se)
 * 
 * General functions that get used within the website
 * 
 **/
var editor; // syntax highlighter
var ez; // object holder of ezcrypto library
var _encrypting = null; // used as flag state to determine if encryption is in mid-progress
var lib = 'CRYPTO_JS';

// default options for our lazy loader
$LAB.setGlobalDefaults( {
	UseLocalXHR: true,
	AlwaysPreserveOrder: false,
	AllowDuplicates: true
} );

$( function() {
	if( document.getElementById( 'content' ) )
	{
		// load up our editor
		editor = CodeMirror.fromTextArea( document.getElementById( 'content' ), {
			lineNumbers: true,
			matchBrackets: false,
			lineWrapping: false,
			readOnly: true
		} );
		
		editor.setOption( 'mode', $( '#syntax' ).val() );
		editor.focus();
	}
	
	// when we detect the text has changed we flag the encryption to trigger off 500ms afterwards
	// if more text gets entered the trigger will continue resetting as not to cause unwanted CPU usage
	$( '#text' ).bind( 'textchange', function() {
		if( _encrypting != null ) { clearTimeout( _encrypting ); _encrypting = null; }
		_encrypting = setTimeout( '$( \'#result\' ).val( ez.aes.encrypt( $( \'#key\' ).val(), $( \'#text\' ).val() ) ); _encrypting = null', 500 );
	} );
	
	enableHover();
} );

// simply class to calculate time difference
var timeDiff = {
	time: undefined,
	setStartTime: function () {
		d = new Date();
		this.time = d.getTime();
	},

	getDiff: function () {
		d = new Date();
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

// generate a random key
function generateKey()
{
	var index = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var key = '';
	for( var i = 1; i < 25; i++ ) { key += index[Math.floor( Math.random() * index.length )] };
	return key;
}

// hover effect when moving mouse over submit button
function enableHover()
{
	$( '#en' ).hover(
		function() {
			$( '#result' ).show();
			$( '#result' ).focus();
		},
		function() {
			$( '#result' ).hide();
			$( '#text' ).focus();
		}
	);
}

// simple function wrapper to decryption time can be logged
function decrypt( cipher, data )
{
	$( '#insertkey' ).hide();
	timeDiff.setStartTime();
	var output = ez.aes.decrypt( cipher, data );
	var diff = timeDiff.getDiff();
	
	$( '#execute' ).html( 'decryption: ' + diff + 'ms');
	$( '.cm-s-default' ).parent().show();
	return output;
}

// simple function wrapper to encryption
// @todo: add timestamp on encrypting?
function encrypt( cipher, data )
{
	return stringBreak( ez.aes.decrypt( cipher, data ), 96 );
}

// when a password is assigned to a paste
// the page doesn't get the encrypted data until your supply the correct password
// this function handles the ajax calling to validate the password and return the data
function requestData( password )
{
	var url = window.location.href;
	var hash = window.location.hash;
	var index_of_hash = url.indexOf( hash ) || url.length;
	var hashless_url = url.substr( 0, index_of_hash );

	$.ajax( {
		url: hashless_url,
		type: 'POST',
		dataType: 'json',
		data: '&p=' + password,
		cache: false,
		success: function( json ) {
			// success, assign the data accordingly
			$( '#result' ).val( json.data );
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
				editor.setValue( decrypt( hash.substring( 1 ), $( '#result' ).val() ) );
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
	else if( _encrypting == null && $( '#result' ).val() == '' && $( '#text' ).val() != '' )
	{
		// it appears the data hasn't been encrypted yet.
		// load our crypto library, 'lib' must be defined in core.js
		ezcrypt( lib, function() {
			ez = this;
			$( '#result' ).val( encrypt( $( '#key' ).val(), $( '#text' ).val() ) );
		} );
	}
	else if( _encrypting != null && $( '#text' ).val() != '' )
	{
		// if still encrypting, test again in 100ms
		setTimeout( 'submitData()', 100 );
		return false;
	}
	
	$( '#en' ).unbind( 'mouseenter mouseleave' );
	$( '#result' ).show();
	
	// make data post friendly
	var data = $( '#result' ).val();
	data = encodeURIComponent( data );
	var password = '';
	if( $( '#usepassword' ).is( ':checked' ) )
	{
		// if password is used, let's sha the password before we send it over
		ezcrypt( lib, function() {
			password = this.sha( $( '#typepassword' ).val() );
		} );
	}
	
	var ttl = $( '#ttl option:selected' ).val();
	var syntax = $( '#syntax option:selected' ).val();
	
	// send submission to server
	$.ajax( {
		url: '/',
		type: 'POST',
		dataType: 'json',
		data: '&data=' + data + '&p=' + password + '&ttl=' + ttl + '&syn=' + syntax,
		cache: false,
		success: function( json ) {
			window.location = '/' + json.id + '#' + $( '#key' ).val();
		},
		error: function() {
			enableHover();
			alert( 'error submitting form' );
		}
	} );
}