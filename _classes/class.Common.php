<?php
require_once('../_classes/class.DBConnection.php');
/**
 * class GroupManager
 * @author  yhlee , <yhlee@thinkfree.com>
 */
class Common{
    /**
	 * @var object $sdb database connection
	 */
    private $db;

	/**
	 * new Common()
	 * @return void
	 */
	public function __construct() {
		$this->db = DBConnection::get()->handle();
	}

	public static function HTTPStatus($num) {
		static $http = array (
			100 => "HTTP/1.1 100 Continue",
			101 => "HTTP/1.1 101 Switching Protocols",
			200 => "HTTP/1.1 200 OK",
			201 => "HTTP/1.1 201 Created",
			202 => "HTTP/1.1 202 Accepted",
			203 => "HTTP/1.1 203 Non-Authoritative Information",
			204 => "HTTP/1.1 204 No Content",
			205 => "HTTP/1.1 205 Reset Content",
			206 => "HTTP/1.1 206 Partial Content",
			300 => "HTTP/1.1 300 Multiple Choices",
			301 => "HTTP/1.1 301 Moved Permanently",
			302 => "HTTP/1.1 302 Found",
			303 => "HTTP/1.1 303 See Other",
			304 => "HTTP/1.1 304 Not Modified",
			305 => "HTTP/1.1 305 Use Proxy",
			307 => "HTTP/1.1 307 Temporary Redirect",
			400 => "HTTP/1.1 400 Bad Request",
			401 => "HTTP/1.1 401 Unauthorized",
			402 => "HTTP/1.1 402 Payment Required",
			403 => "HTTP/1.1 403 Forbidden",
			404 => "HTTP/1.1 404 Not Found",
			405 => "HTTP/1.1 405 Method Not Allowed",
			406 => "HTTP/1.1 406 Not Acceptable",
			407 => "HTTP/1.1 407 Proxy Authentication Required",
			408 => "HTTP/1.1 408 Request Time-out",
			409 => "HTTP/1.1 409 Conflict",
			410 => "HTTP/1.1 410 Gone",
			411 => "HTTP/1.1 411 Length Required",
			412 => "HTTP/1.1 412 Precondition Failed",
			413 => "HTTP/1.1 413 Request Entity Too Large",
			414 => "HTTP/1.1 414 Request-URI Too Large",
			415 => "HTTP/1.1 415 Unsupported Media Type",
			416 => "HTTP/1.1 416 Requested range not satisfiable",
			417 => "HTTP/1.1 417 Expectation Failed",
			500 => "HTTP/1.1 500 Internal Server Error",
			501 => "HTTP/1.1 501 Not Implemented",
			502 => "HTTP/1.1 502 Bad Gateway",
			503 => "HTTP/1.1 503 Service Unavailable",
			504 => "HTTP/1.1 504 Gateway Time-out"
		);
		header($http[$num]);
	}

	public static function truncate_utf8($string, $len, $wordsafe = FALSE, $dots = FALSE) {
		$slen = strlen($string);
		if ($slen <= $len) {
			return $string;
		}
		if ($wordsafe) {
			$end = $len;
			while (($string[--$len] != ' ') && ($len > 0)) {};
			if ($len == 0) {
			  $len = $end;
			}
		}
		if ((ord($string[$len]) < 0x80) || (ord($string[$len]) >= 0xC0)) {
			return substr($string, 0, $len) . ($dots ? ' ...' : '');
		}
		while (--$len >= 0 && ord($string[$len]) >= 0x80 && ord($string[$len]) < 0xC0) {};

		return substr($string, 0, $len) . ($dots ? ' ...' : '');
	}

	public static function mime_header_encode($string, $split = true) {
		if (preg_match('/[^\x20-\x7E]/', $string)) {
			if (!$split) return ' =?UTF-8?B?'. base64_encode($string) ."?=";
				
				$chunk_size = 47; // floor((75 - strlen("=?UTF-8?B??=")) * 0.75);
				$len = strlen($string);
				$output = '';
				while ($len > 0) {
					$chunk = truncate_utf8($string, $chunk_size);
					$output .= ' =?UTF-8?B?'. base64_encode($chunk) ."?=\n";
					$c = strlen($chunk);
					$string = substr($string, $c);
					$len -= $c;
				}
				return trim($output);
			}
		return $string;
	}

	##  encrypt email
	public static function encryptEmail($string) {
		require_once('HTML/Crypt.php');
		$c = new HTML_Crypt("$string", 8);
		$c->addMailTo(); // add <a href="mailto:"></a> around this email
		$c->output(); // output the javascript wich write the decrypted email
	}

	/***********************************************************************
	* environment setting function
	***********************************************************************/

	/**
	 * set thinkfree docs language
	 * @global object $tr translation resources object
	 * @global array $docsLang values for PEAR:Translation
	 * @global array $docsLangSel ' selected' value for default selected language
	 * @return array $docsLang
	 * @return array $docsLangSel
	 */
	public static function setDocsLang() {
		global $tr, $docsLang, $docsLangSel, $_SERVER;

		$supportLang = array("en", "ko", "jp");
		$count = count($supportLang);

		$docsLang["trans2DBInfo"] = array( 'hostspec' => DB_HOST, 'database' => DB_DBNAME, 'phptype'  => 'mysql', 'username' => DB_USER, 'password' => DB_PW );
		for ($ii=0; $ii<$count; $ii++){
			$strings_tables[$supportLang[$ii]] = "translation_i18n_20";
		}
		$docsLang["trans2Params"] = array(
			'langs_avail_table'  => 'translation_langs_avail',
			'lang_id_col'        => 'id',
			'lang_name_col'      => 'name',
			'lang_meta_col'      => 'meta',
			'lang_errmsg_col'    => 'error_text',
			'strings_tables'     => $strings_tables,
			'string_id_col'      => 'id',
			'string_page_id_col' => 'page_id',
			'string_text_col'    => '%s'  //'%s' will be replaced by the lang code
		);

		// priority 1 :: post value
		if (in_array($_POST["selLang"], $supportLang))
		{
			for ($ii=0; $ii<$count; $ii++) {
				if ($_POST["selLang"] == $supportLang[$ii])
				{
					$docsLang["userChoice"] = $supportLang[$ii];
					@setcookie("docsLang","$docsLang[userChoice]", time()+60*60*24*30,"/",".thinkfreedocs.com");  // 30 day
					$_SESSION["sys_lang"] = $docsLang["userChoice"];
				}
			}
			$docsLangSel[$docsLang["userChoice"]] = "selected";
		}
		// priority 2 :: cookie value
		elseif (in_array($_COOKIE["docsLang"], $supportLang))
		{
			$docsLang["userChoice"] = $_COOKIE["docsLang"];
			$docsLangSel[$_COOKIE["docsLang"]] = "selected";
			$_SESSION["sys_lang"] = $docsLang["userChoice"];
		}
		// priority 3 :: browser accept language value check
		else
		{
			$http_lang = $_SERVER['HTTP_ACCEPT_LANGUAGE']; /* mozilla :: ko-kr,ko;q=0.8,en-us;q=0.5,en;q=0.3 / IE 7.0 Korean :: ko / IE 6.0 English :: ko */
			if (stristr($http_lang, "q=")) {
				$tmp_lang = explode(',',$http_lang);
				$ii++;
				foreach ( $tmp_lang as $key=>$val) {
					if (stristr($val, "q="))
					{
						$tmp_lang2 = explode(';q=',$val);
						$tmp_lang3[$tmp_lang2[1]] = $tmp_lang2[0];
					}
					else
						$tmp_lang3[1.0] = $val;
					$ii++;
				}
				krsort($tmp_lang3);
				reset($tmp_lang3);
				$tmp_lang4 = array_values ($tmp_lang3);
				$http_lang = $tmp_lang4[0];
			}

			for ($ii=0; $ii<$count; $ii++) {
				if (stristr($http_lang, "$supportLang[$ii]"))
				{
					$docsLang["userChoice"] = $supportLang[$ii];
					$docsLangSel[$docsLang["userChoice"]] = "selected";
				}
				else if (stristr($http_lang, "ja"))
				{
					$docsLang["userChoice"] = "jp";
					$docsLangSel[$docsLang["userChoice"]] = "selected";
				}

			}
			$_SESSION["sys_lang"] = $docsLang["userChoice"];
		}

		$docsLang["userChoice"] = (!isset($docsLang["userChoice"])) ? "en" : $docsLang["userChoice"];

		return $docsLang. $docsLangSel;
	}


	public static function ray_encode($str){
		return iconv("euc-kr", "utf-8",$str);
	}


	//-----------------------------------------------------------------//

	# public   : getmicrotime()
	# function : 마이크로 타이밍을 구하는 함수
	public static function getmicrotime() {
		$microtimestmp = split(" ",microtime());
		return $microtimestmp[0]+$microtimestmp[1];
	}

	//-----------------------------------------------------------------//
	public static function _FileType($ext) {
        $ext = strtolower($ext);
        switch( $ext ) {
            case "gif":
            case "jpg":
            case "bmp":
            case "png":
            case "rle":
            case "tif":
            case "pcx":
                return "image";
                break;
            case "avi":
            case "mpg":
            case "mpeg":
            case "asf";
            case "asx";
            case "rm";
            case "ram";
            case "ra";
                return "avi";
                break;
            case "html":
            case "htm":
                return "html";
                break;
            case "txt":
            case "c":
            case "cc":
            case "cpp":
            case "js":
            case "php":
            case "php3":
            case "php4":
                return "txt";
                break;
			case "xls":
			case "xlsx":
			    return "xls";
				break;
			case "doc":
			case "docx":
			    return "doc";
				break;
			case "ppt":
			case "pptx":
			    return "ppt";
				break;
			case "pdf";
			    return "pdf";
				break;
			case "psd";
			    return "psd";
				break;
			case "fla";
			    return "fla";
				break;
			case "swf";
			    return "swf";
				break;
            case "arj":
            case "zip":
            case "tar":
            case "tgz":
            case "arc":
            case "lzh":
            case "rar":
            case "cab":
            case "ace":
            case "gzip":
            case "gz";
                return "zip";
                break;
            default:
                return "etc";
                break;
        }
    }


	public static function cleanupHtml($value) {
		$cleanValue = htmlentities($value);
		return $cleanValue;
	}

	public static function cleanupDB($post) {
		IF (GET_MAGIC_QUOTES_GPC()){
			$POST = STRIPSLASHES($POST);
		}
		$CLEANPOST = MYSQL_REAL_ESCAPE_STRING($POST);
		RETURN $CLEANPOST;
	}

	public static function setLang() {
		if($_POST["selLang"]){
			@setcookie("selLang","$_POST[selLang]", time()+60*60*24*30,"/","himh.net");  // 30 day
			$_SESSION["sys_lang"] = $_POST["selLang"];
		}else if($_COOKIE["selLang"]){
			$_SESSION["sys_lang"] = $_COOKIE["selLang"];
		}else{
			$_SESSION["sys_lang"] = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
		}
	}

	public static function mysql2timestamp($datetime){
        if($datetime == "0000-00-00 00:00:00"){
			return false;
		}
		$val = explode(" ",$datetime);
		$date = explode("-",$val[0]);
		$time = explode(":",$val[1]);
		return mktime($time[0],$time[1],$time[2],$date[1],$date[2],$date[0]);
	}


	/**
	 * return multi-language date html code
	 * @global array $_POST
	 * @param integer $adddate unix timestamp value
	 * @param string $type flag for return language
	 * @return string $adddate
	 */
	public static function getMultiLangDate($adddate, $type) {
		global $_POST;
		if ($type == "MjY")
		{
			if ($_SESSION["sys_lang"] == "ko" || $_POST["selLang"] == "ko") $adddate = date("Y년 n월 j일", $adddate);
			elseif ($_SESSION["sys_lang"] == "jp" || $_POST["selLang"] == "jp") $adddate = date("Y年 n月 j日", $adddate);
			else $adddate = date("M j, Y", $adddate);
		}
		else if ($type == "FjY")
		{
			if ($_SESSION["sys_lang"] == "ko" || $_POST["selLang"] == "ko") $adddate = date("Y년 n월 j일", $adddate);
			elseif ($_SESSION["sys_lang"] == "jp" || $_POST["selLang"] == "jp") $adddate = date("Y年 n月 j日", $adddate);
			else $adddate = date("F j, Y", $adddate);
		}
		else if ($type == "mdYagi")
		{
			if ($_SESSION["sys_lang"] == "ko" || $_POST["selLang"] == "ko") $adddate = date("Y년 n월 j일 a g:i", $adddate);
			elseif ($_SESSION["sys_lang"] == "jp" || $_POST["selLang"] == "jp") $adddate = date("Y年 n月 j日 a g:i", $adddate);
			else $adddate = date("j-n-Y a g:i", $adddate);
		}
		else if ($type == "FjY")
		{
			if ($_SESSION["sys_lang"] == "ko" || $_POST["selLang"] == "ko") $adddate = date("Y년 n월 j일", $adddate);
			elseif ($_SESSION["sys_lang"] == "jp" || $_POST["selLang"] == "jp") $adddate = date("Y年 n月 j日", $adddate);
			else $adddate = date("F j, Y", $adddate);
		}
		else if ($type == "FjYagi")
		{
			if ($_SESSION["sys_lang"] == "ko" || $_POST["selLang"] == "ko") $adddate = date("Y년 n월 j일 a g:i", $adddate);
			elseif ($_SESSION["sys_lang"] == "jp" || $_POST["selLang"] == "jp") $adddate = date("Y年 n月 j日 a g:i", $adddate);
			else $adddate = date("F j, Y a g:i", $adddate);
		}
		return $adddate;
	}


	/**
	 * update document's description to mater DB
	 * @param integer  $total    Number of items to page (used only if itemData is not provided).
	 * @param integer  $perpage  Number of items to display on each page.
	 * @param string   $url      name of the page, with a "%d" if append == TRUE.
	 * @return string  $pager    Returns back/next/first/last and page links
	 */
	public static function getPaging($total,$perpage=10, $url, $delta=4, $urlVar="page")
	{
		global $tr;
		require_once ("Pager/Pager.php");
		$pager_options = array(
			'mode'			    => 'Sliding',
			'append'            => false,  //don't append the GET parameters to the url
			'path'              => '',
			'fileName'          => $url,  //Pager replaces "%d" with the page number...
			'perPage'		    => $perpage,
			'delta'			    => $delta,
			'urlVar'		    => $urlVar,
			'totalItems'	    => $total,
			'prevImg'		    => "<span class='prev'>이전</span>" ,
			'nextImg'		    => "<span class='next'>다음</span>",
			'altFirst'		    => "page %d",
			'altPrev'		    => "이전 페이지",

			'curPageSpanPre'	=> "<a href='#' onclick='javascript:return false;' class='selected'>",
			'curPageSpanPost'	=> "</a>",

			//'curPageLinkClassName' => "selected",
			'firstPagePre'		=> "<span class='first'>",
			'firstPageText'	    => "처음",
			'firstPagePost'	    => "</span>",

			'lastPagePre'		=> "<span class='last'>",
			'lastPageText'	    => "마지막",
			'lastPagePost'	    => "</span>",

			'altNext'			=> "다음 페이지",
			'altLast'			=> "page %d",
			//'separator'		    => "<span class='bar'></span>",
			'separator'		    => "",
			'spacesBeforeSeparator'	=> 1,
			'spacesAfterSeparator'	=> 1,
			'clearIfVoid '		=> true
		);

		$pager = Pager::factory($pager_options);
		return $pager->links;
	}

	/**
	 * encrypt text by custom keyword
	 * @param string $txt text to encrypt
	 * @return string $tmp
	 */
	public static function dx_encrypt($txt) {
		$key = "qhdks$cjfwj!";
		$key_len = strlen($key);
		$rot_ptr_set = 9;
		$rot_ptr = $rot_ptr_set;

		$tmp = "";
		$txt = strrev($txt);
		$txt_len = strlen($txt);
		for ($i=0; $i<$txt_len; $i++) {
			if($rot_ptr >= $key_len) $rot_ptr = 0;
			$tmp .= $txt[$i] ^ $key[$rot_ptr];
			$v = ord($tmp[$i]);
			$tmp[$i] = chr(((($v << 3) & 0xf8) | (($v >> 5) & 0x07)));
			$rot_ptr ++;
		}
		$tmp = base64_encode($tmp);
		$tmp = strrev($tmp);
		return $tmp;
	}

	/**
	 * decrypt text by custom keyword
	 * @param string $txt text to encrypt
	 * @return string $tmp
	 */
	public static function dx_decrypt($txt) { $key = "qhdks$cjfwj!"; $key_len = strlen($key);
		$rot_ptr_set = 9;
		$rot_ptr = $rot_ptr_set;

		$tmp = "";
		$txt = strrev($txt);
		$txt = base64_decode($txt);
		$txt_len = strlen($txt);
		for ($i=0; $i<$txt_len; $i++) {
			if($rot_ptr >= $key_len) $rot_ptr = 0;
			$v = ord($txt[$i]);
			$txt[$i] = chr(((($v >> 3) & 0x1f) | (($v << 5) & 0xe0)));
			$tmp .= $txt[$i] ^ $key[$rot_ptr];
			$rot_ptr ++;
		}
		$tmp = strrev($tmp);
		return $tmp;
	}


	
	public static function getDateTime($ical_date) {
		// $ical_date = "20090718T030000Z";
        $arryiCal = explode('T',$ical_date);
        $yy = substr ($arryiCal[0], 0, 4);
		$mm = substr ($arryiCal[0], 4, 2);
		$dd = substr ($arryiCal[0], 6, 2);


        $hh = substr ($arryiCal[1], 0, 2);
		$nn = substr ($arryiCal[1], 2, 2);
		$ss = substr ($arryiCal[1], 4, 2);

		$result = $yy."-".$mm."-".$dd." ".$hh.":".$nn.":".$ss;
		return $result;
	}
}

?>