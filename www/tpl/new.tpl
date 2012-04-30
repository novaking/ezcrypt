<?php
	include dirname( __FILE__ ) . '/includes/header.tpl';
	
?>

				<script type="text/javascript">
					// welcome text that appears on home page encrypted with pidCrypt and crypto-js
					// you can change this message but simply making a new encrypted text and decrypting
					// it below
					var welcome = {
						'PIDCRYPT': 'U2FsdGVkX1/3iv49bDP/yTiHzVR7PGZQb6JhFqv4rFapLXiXa0MF9F0RFMzlk42F89q70qRJQ1CtIW/UeXuFGJQseQ6PVqiL\
g28mQGTQI9AncQ4Yxgmt+XDdgq9dyOurxIBxSsEf7BuYMsZ8qYrr2YjY9Qp3I2c4dC8BmQc1os2eFM03yjMw2mM8RXFpstCC\
SKB6sMQGxjUaydIAeNdzKFILm5+YT9iP84BFfy1OyMMfcu9R2SjB91AFKVX5z+poSCgHNCKu0xNv/tV3bdZPJDjOtfMGqLhj\
65n8EYwjFC0lu0LNFedGRn7bg4nwzcq6jHwZ7XY6mCfmh0YcjK3pNLYX/tjrYtmpfpae+VQNBD1B+5Dr6ZGG/NCNnvWIjLsS\
abyKfMGPzpMYzgfmM6lBavqOgJBH+Q741r54xNsI3zxXqiwpErhBLPfrkKX1cpVzAB0FjukYtoOJ01p2HWg4SnvWnobd1MvM\
5mXzjwwoPbQHaaFhwYHkCwuaHcxFGKSalbU6kwg0Exl7zYUOGBJNrWz43w8bYZPCWQYYSVx+g1CmXbPJ1kvJoY5EoPEuIY4d\
iHrlOyJviWQqwVhRkrgZ6w0NAnq3OBE2QM21o9METPeO4GaNrN+JA2+FMrnj7cFoMUerhOb6STpbkmlqJwOKLMx3qkUtCLSD\
96ftr1aBLMNolSi3lGECoRQfDyyVBisSh231SlcNJ4rQz/Pur/jWbtRbLDPvRezweDCDJv0MDoRbs+/ioP3ZKdljPH/vK5HZ\
puWP1/V9hUyaJ5sNJpKVdsOxVHpDq7KEmGJwM0rJ0fVKS9VDWdrFXPDk+ICJD9Qf3p7v7Zes/C4wuwuE5e1Q7sPNZGJOSlMJ\
MK0q9kfO3J5A2pqbmg8AKBrikL/3EzL9QgV8jb68Qc2BcX/kzaTSSRUsogwz2nU+ABZ6tvz4dOOUQiTQS+OqS54j8cWImmfz\
8D2sW8KuOZG8uM2N3vjHvh42ro6qkPeml5cUapkFVupLv4zRunU85hg4zKsNeNKY1ijVAcXBzj5Aiaa7TEtbu2o3bobRB9wJ\
psalyCIfWlEvd1Z+qWC30/Be4Czc6TAiFhVENDbzhPC7Tri+m3l1fQoIc9c802TIwd6aW0/JT4qqeBUYApJFraQzmJyoN0ta\
ShPxlOt8LD1wzOgB0+yoZX0x2iNPbPBdl/fgAt7Q6nUh0B2u4udxb0LWtrJcGF+vCF2jQb9sZYUeuXMvNoCya0obyq3Gxs5h\
JsjELPe+jn5CHurSTar2sQ1a2roup4m9ursCCPCspO2t3OspnUlSDh2Mem/ejc/2jsZYgiWfD7Jt4S7khMDVdPADLpTQrcA3\
0G4TBgf84gxhGMkdCQKqNBfLFFJIy0gewwl3w3CFFdtldKW2YSKL1HLjNMXr5zW+Qj357NRs/CeTG2ESk1ThEnDDluhbGlt2\
vD2KY85I48e5jK9iO9UfHdw+K65i3WIil8rmweMkqnqpbwG7pzAnWgZyHUXlJSdRkkUhOQg09v2mD7wiioXTSkxBcEPuMRgJ',
						'CRYPTO_JS': 'CPOzHbp0ouIDQ4LbavLkQG3g2Pxu69KeYXsde+QPBMbUacbDHgscveQzkvAtpX5nRKXk9docVl/thAC/rriHDuOMPSI1J5QDd\
FuAYMnP7OLBKG2ZfzEMaGy4GFqzsEFVqnJr2Sf8GpK+TV5Jc0tg7a5t6F77pMCWUIV6zIBlZajzt9t57kuzDeWAHWapRMH2j\
CHtc5yWZWb/j4B7OG4+Ed7qWAw97TWU558RlSRwxWs6i3Z7noO28YCQbZ33uRG5UtCIPOIsjbv0n9LWJVEebjDNRLJb0u8F8\
WBLzt0AxBgYTVChRghNp67Dv41vWndQkRouzD/YImhsBf8XPT/1Q3lQCE3wQ7Gff6YgcjubdJjCMzuYSo5XeGF/NFeZlNcCP\
eQvkJcCK0aRVsAYBKWSHxUEZZJ2oasJ/pVxOjZ35Ya5uQZcZ/FeYnAH2kcuHKKVaLOUAid7emryktpV64c6Iz3cZbq+ZP6Ls\
AKp2oRcnADmDI+nB15gj6Tkl3ornXdt+o1/aHv2PrdKOwEFlm19ex0cCjOlrThiwRs6lF9hI6FTZBDK25xyVWHd0uwYgQBmz\
qj/FAarMn90EIjBKokefP7AXKzSX+UbLDfmdgFf9f0BbYoquIuXDrnSi9fVUwnGZ41XiBUaypFIPsnH+vC4wLHVCR4d+XQ+k\
iRLNC5elJkF3bcj9lP7w6XotvRs23J6Y1HAdYvxUy3Swh7nV6V3XcPBmLNbUrnMqdkQEfDfMhq+py7I5Gi+GUMFHn0ckn2ky\
MJwLjQYjwvLnl7TWM7sULKMf0iRn1HaHrbRwyjvqi0fcr9K4SIeTlC+jG0zGPSw23UCEz+aaPzV0Dwj8kU8l1moK82HChH6K\
BVda/s2Q5WPd+aiZEnOFoKBTi3Fx7xAX1Nc2O9rwSbhl0nZLYoBpn0/JNaTX9CftyGS4ej8MR5ycszqbqAujC+G8Lb0hWGyY\
YJcLa3VcqSDHnJJllyjtli8Up2ovFjdihGtx9kFTIHuP3mSoFMZVBgHU8O5n7I+wFa149PCPGa8M7M1+YWIINHKaLofHAWcm\
71GB9LgWAyIFS9YYqPAzCc9ZRLH2eltpb2OLNgNh3kTPJOJSE1SYn78LSgaAkvwXKMzE8IVAtzARlH92F+mtyxS5rw6yheEf\
2j5dUrCsfiz/x46NH9IPf5sThXNrvpBYKoaRR9VsKL07nMEbf93ooxQnLbqhG90EnJRSMJyFJzlNsBCZt3okpEvlhoLcMQAB\
A2qzQYDeIbELzyutESV2lBLzdbDTXsyZ3SD7a1bzbyuO/d6F1y0QFVy3Git+VXBv1Adf8M/7p5PZsxDFNCNcBh0+boNL3//L\
BPF1kgApra40T2AJSLX3+wKgjSMnhsRp4Wf3e4Vq/p02wD/OLbKrHsAsYhYq2pGOijW6j1G1TQr0130bhnbQk+VNYz+vSmy3\
N0h5DmJUWq33D/BPdbpoHt0IFesJzsgt5dlXPF/zyFeJvDwlKCe3lqfym2f5fJG3YQRV1YqAtEKm9d9EbI='
					};
		
					$( function() {
						editor.setOption( 'readOnly', true );
						editor.setOption( 'mode', 'application/x-httpd-php' );

						// load our crypto library, 'lib' must be defined in core.js
						// decrypt our welcome text
						ezcrypt( lib, function() {
							ez = this;
							editor.setValue( ez.aes.decrypt( 'MzksNTIsMTU5LDc4LDQ1LDQ1LDEwMSwxMjEsMTY2LDE4LDI4LDE3NSwyMzIsMTU1LDI5LDE1MSw4MCw1MSw1NCwxMTUsMTcsNTgsNjQsMjQxLDI0OSwxNDEsMTk1LDk3LDk0LDcsOSwyNDU=', welcome[lib] ) );
						} );
					} );
				</script>
				
				<input type="hidden" id="content" />
				
				<div style="height: 20px; border-bottom: 1px SOLID #f2f2f2;"></div>
				<div style="height: 20px;"></div>
				
				<div class="syntax">
					Formatting:
					<select name="syntax" id="syntax">
						<option disabled="disabled" class="header">- Common Formats -</option>
						<option value="text/plain"<?=$pastes->selected_syntax('text/plain');?>>&nbsp;&nbsp;Plain Text</option>
						<option value="application/x-aspx"<?=$pastes->selected_syntax('application/x-aspx');?>>&nbsp;&nbsp;ASP.NET</option>
						<option value="text/x-bash"<?=$pastes->selected_syntax('text/x-bash');?>>&nbsp;&nbsp;Bash</option>
						<option value="text/x-csrc"<?=$pastes->selected_syntax('text/x-csrc');?>>&nbsp;&nbsp;C</option>
						<option value="text/x-java"<?=$pastes->selected_syntax('text/x-java');?>>&nbsp;&nbsp;Java</option>
						<option value="text/x-c++src"<?=$pastes->selected_syntax('text/x-c++src');?>>&nbsp;&nbsp;C++</option>
						<option value="text/css"<?=$pastes->selected_syntax('text/css');?>>&nbsp;&nbsp;CSS</option>
						<option value="htmlmixed"<?=$pastes->selected_syntax('htmlmixed');?>>&nbsp;&nbsp;HTML mixed-mode</option>
						<option value="text/javascript"<?=$pastes->selected_syntax('text/javascript');?>>&nbsp;&nbsp;JavaScript</option>
						<option value="text/x-perl"<?=$pastes->selected_syntax('text/x-perl');?>>&nbsp;&nbsp;Perl</option>
						<option value="application/x-httpd-php"<?=$pastes->selected_syntax('application/x-httpd-php');?>>&nbsp;&nbsp;PHP</option>
						<option value="text/x-python"<?=$pastes->selected_syntax('text/x-python');?>>&nbsp;&nbsp;Python</option>
						<option value="text/x-ruby"<?=$pastes->selected_syntax('text/x-ruby');?>>&nbsp;&nbsp;Ruby</option>
						<option value="text/x-plsql"<?=$pastes->selected_syntax('text/x-plsql');?>>&nbsp;&nbsp;SQL</option>
						<option value="application/xml"<?=$pastes->selected_syntax('application/xml');?>>&nbsp;&nbsp;XML</option>
						<option disabled="disabled" class="header">- Other Formats -</option>
						<option value="text/x-clojure"<?=$pastes->selected_syntax('text/x-clojure');?>>&nbsp;&nbsp;Clojure</option>
						<option value="text/x-coffeescript"<?=$pastes->selected_syntax('text/x-coffeescript');?>>&nbsp;&nbsp;CoffeeScript</option>
						<option value="text/x-diff"<?=$pastes->selected_syntax('text/x-diff');?>>&nbsp;&nbsp;diff</option>
						<option value="text/x-groovy"<?=$pastes->selected_syntax('text/x-groovy');?>>&nbsp;&nbsp;Groovy</option>
						<option value="text/x-haskell"<?=$pastes->selected_syntax('text/x-haskell');?>>&nbsp;&nbsp;Haskell</option>
						<option value="text/html"<?=$pastes->selected_syntax('text/html');?>>&nbsp;&nbsp;HTML embedded scripts</option>
						<option value="application/x-jsp"<?=$pastes->selected_syntax('application/x-jsp');?>>&nbsp;&nbsp;JavaServer Pages</option>
						<option value="application/json"<?=$pastes->selected_syntax('application/json');?>>&nbsp;&nbsp;JSON</option>
						<option value="jinja2"<?=$pastes->selected_syntax('jinja2');?>>&nbsp;&nbsp;Jinja2</option>
						<option value="text/less"<?=$pastes->selected_syntax('text/less');?>>&nbsp;&nbsp;LESS</option>
						<option value="text/x-lua"<?=$pastes->selected_syntax('text/x-lua');?>>&nbsp;&nbsp;Lua</option>
						<option value="text/x-markdown"<?=$pastes->selected_syntax('text/x-markdown');?>>&nbsp;&nbsp;Markdown</option>
						<option value="text/n-triples"<?=$pastes->selected_syntax('text/n-triples');?>>&nbsp;&nbsp;NTriples</option>
						<option value="text/x-pascal"<?=$pastes->selected_syntax('text/x-pascal');?>>&nbsp;&nbsp;Pascal</option>
						<option value="text/x-rsc"<?=$pastes->selected_syntax('text/x-rsc');?>>&nbsp;&nbsp;R</option>
						<option value="text/x-rst"<?=$pastes->selected_syntax('text/x-rst');?>>&nbsp;&nbsp;reStructuredText</option>
						<option value="text/x-rust"<?=$pastes->selected_syntax('text/x-rust');?>>&nbsp;&nbsp;Rust</option>
						<option value="text/x-scheme"<?=$pastes->selected_syntax('text/x-scheme');?>>&nbsp;&nbsp;Scheme</option>
						<option value="text/x-stsrc"<?=$pastes->selected_syntax('text/x-stsrc');?>>&nbsp;&nbsp;Smalltalk</option>
						<option value="application/sparql"<?=$pastes->selected_syntax('application/sparql');?>>&nbsp;&nbsp;SPARQL</option>
						<option value="text/x-stex"<?=$pastes->selected_syntax('text/x-stex');?>>&nbsp;&nbsp;sTeX, LaTeX</option>
						<option value="text/x-tiddlywiki"<?=$pastes->selected_syntax('text/x-tiddlywiki');?>>&nbsp;&nbsp;Tiddlywiki</option>
						<option value="text/velocity"<?=$pastes->selected_syntax('text/velocity');?>>&nbsp;&nbsp;Velocity</option>
						<option value="text/x-verilog"<?=$pastes->selected_syntax('text/x-verilog');?>>&nbsp;&nbsp;Verilog</option>
						<option value="text/x-yaml"<?=$pastes->selected_syntax('text/x-yaml');?>>&nbsp;&nbsp;YAML</option>
					</select>
					<div style="float: right; font-size: 11px; color: #666; font-style: italic;">Please note, that pasting a large amount of text may cause your browser to hang while encryption/decryption occurs.</div>
				</div>
				
				<div style="position: relative;">
					<textarea id="text" name="text" spellcheck="false"></textarea>
					<textarea id="result" name="result" readonly spellcheck="false"></textarea>
				</div>
				
				<div id="options">
					<acronym title="Expire this paste after the period of time selected">Expire in</acronym>
					<select id="ttl">
						<option value="300">five minutes</option>
						<option value="3600">an hour</option>
						<option value="86400">a day</option>
						<option value="604800" selected="selected">a week</option>
						<option value="2592000">a month</option>
						<option value="31536000">a year</option>
						<option value="-1">indefinately</option>
					</select>
					&nbsp;|&nbsp;
					<label for="usepassword"><acronym title="This password is not used to encrypt the paste">Assign password</acronym></label>&nbsp;<input id="usepassword" type="checkbox" name="usepassword" value="1" />
					<input type="text" id="typepassword" name="password" style="display: none;" />
					
					<input type="hidden" id="key" name="key" />
				 	<input type="submit" id="en" value="Submit" onclick="return submitData();" style="float: right;" />
				</div>
			
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