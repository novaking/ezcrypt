
				<div id="push"></div>
			</div>
			<div id="footer" class="gradient">
				<?=$site_footer?>
			</div>
		</div>
		<script type="text/javascript" charset="utf8" src="<?=$site_url?>jslibs/jquery-1.7.1.min.js"></script>
		<script type="text/javascript" charset="utf8">
			$.noConflict();
			jQuery( document ).ready( function() {
				$ = $.attachReady( jQuery.noConflict() );
			} );
		</script>
		<script type="text/javascript" src="<?=$site_url?>jslibs/jquery.textchange.min.js"></script>
		<script type="text/javascript" src="<?=$site_url?>jslibs/codemirror/codemirror.min.js"></script>
		<script type="text/javascript" src="<?=$site_url?>jslibs/codemirror/mode/combined.min.js"></script>
		<script type="text/javascript" src="<?=$site_url?>jslibs/crypt-0.4.min.js"></script>
	</body>
</html>