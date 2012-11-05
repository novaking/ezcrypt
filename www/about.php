<?php
	require_once dirname( __FILE__ ) . '/inc/config.inc.php';
	require_once dirname( __FILE__ ) . '/inc/templates.class.php';
	
	$template = new Template();
	$template->assign( 'meta_title', 'EZCrypt - About' );

	// About Page
	$template->render( 'about.tpl' );
