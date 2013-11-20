<?php
	$this->incl('includes/header.tpl');
?>
	<script type="text/javascript">
		head.ready(function() { $( function() {
			var editor = ezcrypt.editor;
			var key = window.location.hash.substring( 1 );
			var data = $( '#data' ).val();
			if( key != '' && data != '' )
			{
				editor.setValue( ezcrypt.decrypt( key, data ) );
			}
			else
			{
				$( '#typepassword,#typekey' ).live( 'keydown', function( e ) { if( e.keyCode == 13 ) { $( this ).parent().find( 'input[type=button]' ).click(); } } );
				$( '.cm-s-default' ).parent().hide();
				$( '#decrypting' ).hide();
<?php
	if( $require_password )
	{
?>
				$( '#askpassword' ).show();
				$( '#typepassword' ).focus();
<?php
	}
	else
	{
?>
					$( '#insertkey' ).show();
					$( '#typekey' ).focus();
<?php
	}
?>
			}
		} ); } );
	</script>
<?php
	if( $require_password )
	{
?>
	<div id="askpassword">
		Enter password:&nbsp;
		<input type="password" id="typepassword" style="width: 250px;" autocomplete="off"/>&nbsp;
		<input type="button" id="submitpassword" value="Submit" />
	</div>
<?php
	}
?>
	<div id="insertkey">
		Enter key to decrypt:&nbsp;
		<input type="text" id="typekey" style="width: 450px;" autocomplete="off" />&nbsp;
		<input type="button" value="Decrypt" onclick="window.location = '#' + $( '#typekey' ).val(); editor.setValue( decrypt( $( '#typekey' ).val(), $( '#data' ).val() ) );" />
	</div>
	<input type="hidden" name="syntax" id="syntax" value="<?=$syntax;?>" />
	<input type="hidden" name="data" id="data" value="<?=$data;?>" />
	
	<div id="newpaste">
		<?php $this->incl('includes/new.tpl'); ?>
	</div>
	
	<div id="wrapholder">
		<a id="new">New</a>
		<a id="clone">Clone</a>
		<label class="tool-numbers tool-numbers-on" for="tool-numbers" title="Toggle Numbers"></label> <input type="checkbox" checked="checked" id="tool-numbers" />
		<label class="tool-wrap" for="tool-wrap" title="Wrap Lines"></label> <input type="checkbox" id="tool-wrap" />
		<label class="tool-fullscreen" for="tool-fullscreen" title="Fullscreen"></label> <input type="checkbox" id="tool-fullscreen" />
	</div>
	<div id="wrap" style="clear: both;"></div>
	
	<div id="decrypting"></div>
	<input type="hidden" id="content" />
	
	<div id="speed"><div id="totaltime"></div><div id="execute"></div><div id="coloring"></div></div>

	<noscript>
		<div id="noscript">
			<p>
				EZCrypt relies entirely on JavaScript support to function. Enable
				JavaScript in order to use EZCrypt.
			</p>
		</div>
	</noscript>
<?php
	$this->incl('includes/footer.tpl');
