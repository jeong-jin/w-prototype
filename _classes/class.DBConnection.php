<?php
require_once "DB.php";

/**
 * singleton pattern :: http://www-128.ibm.com/developerworks/opensource/library/os-php-designptrns/#N10110
 *
 * how to use
 * $mdb = DBConnection::get("master")->handle(); // return master database connection object
 * $sdb = DBConnection::get("slave")->handle(); // return slave database connection object
 *
 */
class DBConnection {

    /**
	 * @var string user value for database connection.
	 */
    private $user = "skyletter";
    /**
	 * @var string password value for database connection.
	 */
    private $password = "wndrhrehd";
    /**
	 * @var string result host for database connection.
	 */
    private $host = "1.226.84.218";
    /**
	 * @var string datebase value for database connection.
	 */
    private $database = "skyletter";
    /**
	 * @var object database connection object.
	 */
    private $_handle = null;

    /**
     * this Class can't "New DBConnection", cuz __construct is private.
     * @param string $db_type database connection host (masterr or slave)
     * @return void
     *
     */
  private function __construct($db_type = '')
    {

    	switch($db_type)
        {
            case("master") :
                $this->host = "localhost";
                $dsn = "mysql://$this->user:$this->password@$this->host/$this->database";
                $this->_handle =& DB::Connect( $dsn, array() );
                $this->_handle->query("SET NAMES 'utf8'"); // http://www.shawnolson.net/a/946/unicode-data-with-php-5-and-mysql-41.html
                //$this->_handle->query("SET NAMES 'euckr'");
                // echo "::master connected</br >";
                // var_dump($this->_handle);
                break ;

            default : // slave
                $this->host = "localhost";
                $dsn = "mysql://$this->user:$this->password@$this->host/$this->database";
                $this->_handle =& DB::Connect( $dsn, array() );
                $this->_handle->query("SET NAMES 'utf8'");
				//$this->_handle->query("SET NAMES 'euckr'");
                // echo "::slave connected</br >";
                // var_dump($this->_handle);
                break ;
        }
    }

    /**
     * call database connection object construct
     * @param string $db_type database connection host (masterr or slave)
     * @return object $mdb | $sdb
     *
     */
    public static function get($db_type='')
    {
        if ($db_type == "master")
        {
            static $mdb = null;
            if ( $mdb == null )
                $mdb = new DBConnection($db_type);
            return $mdb;
        }
        else
        {
            static $sdb = null;
            if ( $sdb == null )
                $sdb = new DBConnection($db_type);
            return $sdb;
        }

    }
    /**
     * return database connection object
     * @return object $_handle (database connection object)
     *
     */
    public function handle(){
        return $this->_handle;
    }

}

?>