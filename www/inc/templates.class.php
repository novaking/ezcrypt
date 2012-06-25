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
		
		function __construct()
		{
			//$this->assign( 'google_verify', '<meta name="verify-v1" content="HfJckMzdut1OAtGdt9CiJPYlzbRAlmFMrZFEcGThxQ0=" />' );
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
		
		public function render( $__template_name = null )
		{
			if( $__template_name === null ) throw new Exception( 'Missing template to render' );
			
			$__filename = dirname( __FILE__ ) . '/../tpl/' . $this->theme . '/' . $__template_name;
			
			if( !is_file( $__filename ) )
			{
				throw new Exception( 'Template file ('.$this->theme.':'.$__template_name.') does not exist');
			}
			
			// extract template values and skip already existing variables (to stop possible injections)
			extract( $this->template_vars, EXTR_SKIP );
			
			// include our template
			require $__filename;
		}
	}