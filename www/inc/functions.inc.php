<?php

	/**
	 * Translates a number to a short alhanumeric version
	 *
	 * Translated any number up to 9007199254740992
	 * to a shorter version in letters e.g.:
	 * 9007199254740989 --> PpQXn7COf
	 *
	 * specifiying the second argument true, it will
	 * translate back e.g.:
	 * PpQXn7COf --> 9007199254740989
	 *
	 * this function is based on any2dec && dec2any by
	 * fragmer[at]mail[dot]ru
	 * see: http://nl3.php.net/manual/en/function.base-convert.php#52450
	 *
	 * If you want the alphaID to be at least 3 letter long, use the
	 * $pad_up = 3 argument
	 *
	 * In most cases this is better than totally random ID generators
	 * because this can easily avoid duplicate ID's.
	 * For example if you correlate the alpha ID to an auto incrementing ID
	 * in your database, you're done.
	 *
	 * The reverse is done because it makes it slightly more cryptic,
	 * but it also makes it easier to spread lots of IDs in different
	 * directories on your filesystem. Example:
	 * $part1 = substr($alpha_id,0,1);
	 * $part2 = substr($alpha_id,1,1);
	 * $part3 = substr($alpha_id,2,strlen($alpha_id));
	 * $destindir = "/".$part1."/".$part2."/".$part3;
	 * // by reversing, directories are more evenly spread out. The
	 * // first 26 directories already occupy 26 main levels
	 *
	 * more info on limitation:
	 * - http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/ruby-talk/165372
	 *
	 * if you really need this for bigger numbers you probably have to look
	 * at things like: http://theserverpages.com/php/manual/en/ref.bc.php
	 * or: http://theserverpages.com/php/manual/en/ref.gmp.php
	 * but I haven't really dugg into this. If you have more info on those
	 * matters feel free to leave a comment.
	 *
	 * @author	Kevin van Zonneveld <kevin@vanzonneveld.net>
	 * @author	Simon Franz
	 * @author	Deadfish
	 * @copyright 2008 Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	 * @license	 http://www.opensource.org/licenses/bsd-license.php New BSD Licence
	 * @version	 SVN: Release: $Id: alphaID.inc.php 344 2009-06-10 17:43:59Z kevin $
	 * @link	http://kevin.vanzonneveld.net/
	 *
	 * @param mixed	 $in	String or long input to translate
	 * @param boolean $to_num	Reverses translation when true
	 * @param mixed	 $pad_up	Number or boolean padds the result up to a specified length
	 *
	 * @return mixed string or long
	 */
	function alphaID( $in, $to_num = false, $pad_up = false )
	{
		$__conf = get_config();
		$index = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$i = array( 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' );
	
		if( !empty( $__conf['paste']['secret'] ) )
		{
			// Although this function's purpose is to just make the
			// ID short - and not so much secure,
			// with this patch by Simon Franz (http://blog.snaky.org/)
			// you can optionally supply a password to make it harder
			// to calculate the corresponding numeric ID
			for( $n = 0; $n < strlen( $index ); $n++ )
			{
				$i[] = substr( $index, $n, 1 );
			}
		 
			$passhash = hash( 'sha256', $__conf['paste']['secret'] );
			$passhash = ( strlen( $passhash ) < strlen( $index ) ) ? hash( 'sha512', $__conf['paste']['secret'] ) : $passhash;
		 
			for( $n = 0; $n < strlen( $index ); $n++ )
			{
				$p[] =	substr( $passhash, $n, 1 );
			}
		 
			array_multisort( $p, SORT_DESC, $i );
			$index = implode( $i );
		}
		
		$base = strlen( $index );
	
		if( $to_num )
		{
			// Digital number <<-- alphabet letter code
			$in = strrev( $in );
			$out = 0;
			$len = strlen( $in ) - 1;
			for( $t = 0; $t <= $len; $t++ )
			{
				$bcpow = bcpow( $base, $len - $t );
				$out += strpos( $index, $in[$t] ) * $bcpow;
			}
	
			if( is_numeric( $pad_up ) )
			{
				$pad_up--;
				if( $pad_up > 0 )
				{
					$out -= pow( $base, $pad_up );
				}
			}
		}
		else
		{
			// Digital number -->> alphabet letter code
			if( is_numeric( $pad_up ) )
			{
				$pad_up--;
				if( $pad_up > 0 )
				{
					$in += pow( $base, $pad_up );
				}
			}
	
			$out = '';
			for( $t = floor( log10( $in ) / log10( $base ) ); $t >= 0; $t-- )
			{
				$bcp = bcpow( $base, $t );
				$a = (int) floor( $in / $bcp );
				$out .= $index[$a];
				$in -= $a * $bcp;
			}
			$out = strrev( $out ); // reverse
		}
	
		return $out;
	}
