<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><?=$meta_title?></title>
		<base href="<?=$site_url?>" />
		<meta name="description" content="EZCrypt - The original safer way to encrypt your pastes online!" />
		<meta name="keywords" content="ezcrypt, encryption, pastebin, paste, secure, aes" />
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		<?if( !isset($norobots) || $norobots !== false ) {?><meta name="robots" content="noarchive" />
		<meta name="googlebot" content="nosnippet" />
		<meta name="googlebot" content="noarchive" />
		<?}?><meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="pragma" content="no-cache" />
		<link rel="stylesheet" href="<?=$site_url?>css/styles.min.css" />
		<link rel="shortcut icon" href="<?=$site_url?>favicon.ico" />

		<!--[if gte IE 9]>
		<style type="text/css">
			.gradient { filter: none !important; }
		</style>
		<![endif]-->

		<?php $this->incl('includes/javascripts.tpl'); ?>
	</head>
	<body>
		<!--
		<div id="overlay"><div id="popup">
			<div class="success">Paste created successfully!</div>
			<div style="height: 10px;"></div>
			<input type="text" readonly="readonly" value="" class="url" onclick="$( this ).select();" onfocus="$( this ).select();" />
			<div style="height: 5px;"></div>
			Please note that the above URL can only be used once, as it will be deleted after being displayed.
		</div></div>
		-->
		<div id="holder">
			<div id="header" class="gradient">
				<a href="/">EZCrypt</a> <span class="small">v0.4</span> - Giving you the power to encrypt your information
			</div>
			<div id="menu">
				<a href="<?=$site_url?>">Home</a>
				<span class="small">&nbsp;</span>
				<a href="<?=$site_url?>about">About</a>
				<span class="small">&nbsp;</span>
				<a href="<?=$site_contact?>">Contact</a>
				<span class="small">&nbsp;</span>
				<a href="<?=$site_url?>ezcrypt">Ruby CLI script</a>
				<span class="small">&nbsp;</span>
				<a href="<?=$site_source?>" target="_blank">Sourcecode</a>
				<span class="small">&nbsp;</span>
				<div style="position: absolute; right: 0px; top: 10px;"><a href="http://flattr.com/thing/647627/EZCrypt" target="_blank"><img src="<?=$site_url?>css/flattr-badge-large.png" alt="Flattr this" title="Flattr this" border="0" width="93" height="20" /></a></div>
			</div>
			<div id="main">
