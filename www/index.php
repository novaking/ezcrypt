<?php
	require_once dirname( __FILE__ ) . '/inc/controller.class.php';

	$controller = new Controller();
	$password = !empty ($_REQUEST['p']) ? $_REQUEST['p'] : '';

	if( !empty( $_GET['id'] ) ) {
		$controller->show( $_GET['id'], $password );
	}
	elseif( !empty( $_SERVER['PATH_INFO'] ) )
	{
		$parts = array_values( array_filter( explode( '/', $_SERVER['PATH_INFO'] ) ) );
		if( count( $parts ) >= 1 )
		{
			switch( $parts[0] )
			{
			case 'about':
				$controller->about();
				break;
			case 'ezcrypt':
				$controller->ezcrypt_script();
				break;
			case 'p': // "safe" urls working with all paste ids
				$controller->show( count( $parts ) >= 2 ? $parts[1] : '', $password );
				break;
			default: // paste ids that are not "special"
				$controller->show( $parts[0], $password );
				break;
			}
		}
		else
		{
			$controller->index();
		}
	}
	elseif( !empty( $_POST ) )
	{
		// new post submission
		$controller->post( $_POST['data'], $_POST['syn'], $_POST['ttl'], $_POST['p'] );
	}
	else
	{
		$controller->index();
	}
