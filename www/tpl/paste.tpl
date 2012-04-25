<?php
	include dirname( __FILE__ ) . '/includes/header.tpl';
?>

	<script type="text/javascript">
		$( function() {
			// load our crypto library
			// lib must be defined in core.js
			ezcrypt( lib, function() {
				ez = this;
	
				var key = window.location.hash.substring( 1 );
				var data = $( '#result' ).val();
				if( key != '' && data != '' )
				{
					editor.setValue( decrypt( window.location.hash.substring( 1 ), $( '#result' ).val() ) );
					
					$( '#wrap' ).bind( 'click', function() { var checked = $( '#wrap' ).is( ':checked' ); if( checked == 1 ) { editor.setOption( 'lineWrapping', true ); } else { editor.setOption( 'lineWrapping', false ); } } );
					$( '#wrapholder' ).show();
				}
				else
				{
					$( '#typepassword,#typekey' ).live( 'keydown', function( e ) { if( e.keyCode == 13 ) { $( this ).parent().find( 'input[type=button]' ).click(); } } );
					$( '.cm-s-default' ).parent().hide();
<?php
						if( !empty( $password ) )
						{
							echo <<< JS
					$( '#askpassword' ).show();
					$( '#typepassword' ).focus();

JS;
						}
						else
						{
							echo <<< JS
					$( '#insertkey' ).show();
					$( '#typekey' ).focus();

JS;
						}
?>

				}
			} );
		} );
	</script>
<?php
	if( !empty( $password ) )
	{
?>
	<div id="askpassword">
		Enter password:&nbsp;
		<input type="password" id="typepassword" style="width: 250px;" autocomplete="off" />&nbsp;
		<input type="button" value="Submit" onclick="requestData( ez.sha( $( '#typepassword' ).val() ) );" />
	</div>
<?php
	}
?>
	<div id="insertkey">
		Enter key to decrypt:&nbsp;
		<input type="text" id="typekey" style="width: 450px;" autocomplete="off" />&nbsp;
		<input type="button" value="Decrypt" onclick="window.location = '#' + $( '#typekey' ).val(); editor.setValue( decrypt( $( '#typekey' ).val(), $( '#result' ).val() ) );" />
	</div>
	<input type="hidden" name="syntax" id="syntax" value="<?=$syntax;?>" />
	<input type="hidden" name="result" id="result" value="<?=$paste;?>" />
	
	<div id="wrapholder" style="float: right; display: none;">
		<label for="wrap">Wrap Lines</label> <input type="checkbox" id="wrap" />
	</div>
	<div id="wrap" style="clear: both;"></div>
	<input type="hidden" id="content" />
	
	<div id="execute"></div>

	<noscript>
		<div id="noscript">
			<p>
				EZCrypt relies entirely on JavaScript support to function. Enable
				JavaScript in order to use EZCrypt.
			</p>
		</div>
	</noscript>
<?php
	include dirname( __FILE__ ) . '/includes/footer.tpl';