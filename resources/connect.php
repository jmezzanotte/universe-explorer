<?php 
	// enhance security by parsing the url to get the database information instead 
	// this way you don't have to reveal it here in the code
	$dbc = mysql_connect('us-cdbr-iron-east-03.cleardb.net', 'jmezzanotte', 'fairlady95');
	if(!$dbc) {
		die('Not Connected : ' . mysql_error()); // die will kill the script
	}
	
	
	mysql_set_charset('utf8', $dbc);
	$db_selected = mysql_select_db('heroku_3c7fa83d067981b', $dbc);
	
	if(!$db_selected){
		die('Can\'t use mysql : ' . mysql_error());
	}


?>
