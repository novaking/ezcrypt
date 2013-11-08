<?php

	/**
	 * Basic PHP based template system
	 * 
	 * Allows simple variable assigning to the template class
	 * so have more control over feel of the site and not have it all
	 * clumped into one massive file with html injected on the fly
	 * 
	 * @author NovaKing
	 * @version 0.4
	 **/
	class Template
	{
		protected $template_vars = array();
		private $theme = 'default';
		private $format = 'html';

		function __construct()
		{
			$config = get_config();
			foreach ($config['site'] as $key => $value) {
				$this->assign('site_' . $key, $value);
			}
		}

		// assign template version
		public function assign( $name, $value )
		{
			$this->template_vars[$name] = $value;
		}

		public function theme( $theme )
		{
			if( is_dir( dirname( __FILE__ ) . '/../tpl/' . $theme ) )
			{
				$this->theme = $theme;
			}
		}

		public function format( $format )
		{
			$this->format = $format;
		}

		public function status_text( $code )
		{
			switch ( $code )
			{
			case 200: return "OK";
			case 403: return "Forbidden";
			case 404: return "Not found";
			default: throw new Exception( 'Unknown status code' );
			}
		}

		// for status 200: raw rendering needs $object['data'], json outputs $object
		public function render( $status_code, $template_name = null, $object = array() )
		{
			header ('HTTP/1.1 ' . $status_code . $this->status_text( $status_code ) );

			if ($status_code !== 200 && $this->format != 'html') {
				header( 'Content-Type: text/plain' );
				echo $this->status_text( $status_code );
				return;
			}

			switch ( $this->format )
			{
			case 'html':
				$this->template_vars = array_merge( $this->template_vars, $object );
				$this->incl( $template_name );
				break;
			case 'json':
				header( 'Content-Type: application/json' );
				echo json_encode( $object );
				break;
			case 'raw':
				header( 'Content-Type: application/octet-stream' );
				echo $object['data'];
				break;
			}
		}

		public function incl_find_file( $template_name )
		{
			if( $template_name === null ) throw new Exception( 'Missing template to render' );

			$basedir = dirname( __FILE__ ) . '/../tpl/';

			if ( is_file ( $basedir . $this->theme . '/' . $template_name ) ) {
				return $basedir . $this->theme . '/' . $template_name;
			} else if ( $this->theme !== 'default' && is_file ( $basedir . 'default/' . $template_name ) ) {
				return $basedir . 'default/' . $template_name;
			} else {
				throw new Exception( 'Template file ('.$__template_name.') does not exist');
			}
		}

		public function incl( $__template_name ) {
			// extract template values and skip already existing variables (to stop possible injections)
			extract( $this->template_vars, EXTR_SKIP );

			// include our template
			require $this->incl_find_file( $__template_name );
		}
	}
