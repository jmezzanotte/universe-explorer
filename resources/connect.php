<?php 
		
	$dbc = mysql_connect('us-cdbr-iron-east-03.cleardb.net', 'babcdfac2ed8d3', 'fc9defaa');
	
	if(!$dbc) {
		die('Not Connected : ' . mysql_error()); // die will kill the script
	}
	
	
	mysql_set_charset('utf8', $dbc);
	$db_selected = mysql_select_db('PlanetsApp', $dbc);
	
	if(!$db_selected){
		die('Can\'t use mysql : ' . mysql_error());
	}


?>
