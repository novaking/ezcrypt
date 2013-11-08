<?php
	$this->incl('includes/header.tpl');
?>

	<script type="text/javascript">
		head.ready(function() { $( function() {
			// welcome text that appears on home page encrypted with pidCrypt and crypto-js
			// you can change this message but simply making a new encrypted text and decrypting
			// it below
			var welcome = 'CPOzHbp0ouIDQ4LbavLkQG3g2Pxu69KeYXsde+QPBMbUacbDHgscveQzkvAtpX5nRKXk9docVl/thAC/rriHDuOMPSI1J5QDd\
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
N0h5DmJUWq33D/BPdbpoHt0IFesJzsgt5dlXPF/zyFeJvDwlKCe3lqfym2f5fJG3YQRV1YqAtEKm9d9EbI=';

			editor.setOption( 'readOnly', true );
			editor.setOption( 'lineNumbers', false );
			editor.setOption( 'mode', 'application/x-httpd-php' );

			editor.setValue( decrypt( 'MzksNTIsMTU5LDc4LDQ1LDQ1LDEwMSwxMjEsMTY2LDE4LDI4LDE3NSwyMzIsMTU1LDI5LDE1MSw4MCw1MSw1NCwxMTUsMTcsNTgsNjQsMjQxLDI0OSwxNDEsMTk1LDk3LDk0LDcsOSwyNDU=', welcome ) );
		}); });
	</script>

	<input type="hidden" id="content" />
	<div id="speed"><div id="totaltime"></div><div id="execute"></div><div id="coloring"></div></div>

	<div style="height: 20px; border-bottom: 1px SOLID #f2f2f2;"></div>
	<div style="height: 20px;"></div>

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
