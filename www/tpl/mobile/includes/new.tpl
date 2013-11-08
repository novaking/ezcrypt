<div class="syntax">
	<?php $this->incl('includes/syntax-select.tpl'); ?>
	<div style="float: right; font-size: 11px; color: #666; font-style: italic;">Please note, that pasting a large amount of text may cause your mobile to hang while encryption/decryption occurs.</div>
</div>

<div style="clear: both; position: relative;">
	<textarea id="text" name="text" spellcheck="false"></textarea>
	<textarea id="result" name="result" readonly spellcheck="false"></textarea>
	<div id="encrypttime"></div>
</div>

<div id="options">
	<acronym title="Expire this paste after the period of time selected">Expire in</acronym>
	<select id="ttl">
		<!--<option value="-100">one-time only</option>-->
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
	<input type="submit" id="en" value="Submit" onclick="return submitData('<?=$site_url?>');" style="float: right;" />
</div>
