<?php
	$this->incl('includes/header.tpl');
?>

				<script type="text/javascript">
					// welcome text that appears on home page encrypted with pidCrypt and crypto-js
					// you can change this message but simply making a new encrypted text and decrypting
					// it below
					var welcome = 'Zr8mIp+HfTGf4fQT6fahIo6jABfRLct3FDlhTTLoviagn1GvT+mWuFPJf+ZIqZPZ9uDDm9ybrA2z19vnINF0wigEXHmz94ec\
MhjxfofdLMVGc1M07PxIwfk1CrALuxIE7AVWC4vUT9jdLqmKztAlvRXAh299UqsRiya3NCSohkSao+X3Zw8lbw8f77maWeqX\
awV96ru/Bccc5Rl17wfWmupiZb2ix8OjQ+OQ2T4dlr9QWHavCVLEv/H1eON61P0GoQlp8W+gBY1rk3kab4rqxFAGTPjqNhaL\
WIK7eqhKekFnF8qMpXI7e2ktsSqi3wDzzygUmOfvZ+JCa4qutEcUa9y4OW3OAf8pt8MeFKvoSHUcsA9q6KSJDvBl90PjWpTW\
DrLTDDlEgKgZF7TlJmGgtdHuKrNl/EfpDwJwCxOXAaQ4sWasnhOgG6RSsaWWyxMSA9blZf5BnxN1ercSRToMft2IJiyVqffB\
VoDLytU7LUVcDLwqDy9hzXifzEeGeeBdS55rBYfSHMhLI4vIEioiyQUjOloyk+2B9ws41DJEOgbcuxPDpLiMIZk5+WYDHpSE\
KeXrvOb/x8e7UZu+XTOV6xRp25U=';

					$( function() {
						editor.setOption( 'readOnly', true );
						editor.setOption( 'lineNumbers', false );
						editor.setOption( 'mode', 'htmlmixed' );

						// load our crypto library, 'lib' must be defined in core.js
						// decrypt our welcome text
						ezcrypt( lib, function() {
							ez = this;
							editor.setValue( decrypt( 'MzksNTIsMTU5LDc4LDQ1LDQ1LDEwMSwxMjEsMTY2LDE4LDI4LDE3NSwyMzIsMTU1LDI5LDE1MSw4MCw1MSw1NCwxMTUsMTcsNTgsNjQsMjQxLDI0OSwxNDEsMTk1LDk3LDk0LDcsOSwyNDU=', welcome ) );
						} );
					} );
				</script>

				<input type="hidden" id="content" />
				<div id="speed"><div id="totaltime"></div><div id="execute"></div><div id="coloring"></div></div>

				<div style="height: 20px; border-bottom: 1px SOLID #f2f2f2;"></div>
				<div style="height: 5px;"></div>

				<?php $this->incl('includes/new.tpl'); ?>

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
