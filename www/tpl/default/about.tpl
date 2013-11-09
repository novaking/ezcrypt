<?php
	$this->incl('includes/header.tpl');
?>
<h1>About EZCrypt</h1>
<br />
We created EZCrypt because we wanted to give you the power to protect your information from everyone,<br />
including us! In a typical private pastebin, you upload your data and you trust the security of the<br />
server and the integrity of it's operators. With EZCrypt, you get a <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">Javascript file</a> which encrypts your<br />
paste using state of the art <a href="http://en.wikipedia.org/wiki/Advanced_Encryption_Standard" target="_blank">AES-256-OFB cipher</a> before it ever leaves your computer!<br />
The link to your paste contains the key to decrypt it which you can share with whomever you want.<br />
<br />
The decryption key never touches our server and that means if something bad were to happen,<br />
all of your pastes would still be safe.<br />
<br />
<br />
How it works (replace AES 128bit with 256 bit):<br />
<br />
<img src="<?=$site_url?>css/how-it-works.png" width="850" height="328" /><br />
<br />
When you upload a paste, Javascript generates a random key which is used to encrypt your data.<br />
You can see what your paste will look like to our server by holding the mouse over the "Submit" button.<br />
<br />
<b>Q:</b> How can the key be in the link and the server still not see it?<br />
<b>A:</b> The key is stored in the <a href="http://en.wikipedia.org/wiki/Fragment_identifier" target="_blank">Anchor Hash</a>, the part after the "#" which is not uploaded to the server but<br />
is available to Javascript on your computer.<br />
<br />
<b>Q:</b> Can this prevent my internet service provider from reading my paste?<br />
<b>A:</b> Yes, the packets which are sent over the wire are in the scrambled form. However, if an attacker<br />
*modified* the Javascript file while it was being sent to you, they could add a security vulnerability.<br />
These so-called "<a href="http://en.wikipedia.org/wiki/Man-in-the-middle_attack" target="_blank">Man in The Middle</a>" attacks are much less frequent than passive listening and unlike<br />
passive listening, they are detectable.<br />
<br />
<br />
<?php
	$this->incl('includes/footer.tpl');
