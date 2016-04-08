<?php 
	
	// purpose of this script is to query the database and return the data to the javascript as json
	// selected is the name of variable in the GET request 
	header("Access-Control-Allow-Origin: *");
	// connect to the database
	include('connect.php');
	
	// Used to generate menu data
	
	if(isset($_GET['menu'])){
		
		$menu = $_GET['menu'];
		
		if($menu == 'planets'){
			$query = 'SELECT planetName FROM ' . $_GET['menu'] . ';';
		}else if($menu == 'galaxies'){
			$query = 'SELECT galaxyName FROM ' . $_GET['menu'] . ';';
		}
		
		if($result = mysql_query($query)){
			
			$rows = array();
			$rows[] = 'Select';
				
			while($r = mysql_fetch_assoc($result)){
				
				if($menu == 'planets'){
					$rows[] = $r['planetName'];
				}else if($menu == 'galaxies'){
					$rows[] = $r['galaxyName'];
				}
			
			} // end while
				
			if($menu == 'planets'){
				$rows[] = 'Galaxies';
			}
				
			print json_encode($rows);
				
		}else{
			print 'error';
				
		} // end sql query check if	
	} // end menu name check if
	
	
	if(isset($_GET['planet'])){
		
		$selected = $_GET['planet'];
		
		// pass the url parameter all if you want to return everything from the 
		// planets database as json
		if($selected == 'all'){
			
			//$query = 'SELECT * FROM Planets;' ;
			
			if($result = mysql_query($query)){
			
				$rows = array();
			
				while($r = mysql_fetch_assoc($result)){
					
					$planet = array(
						'name' => $r['planetName'],
						'type' => $r['planetType'],
						'homeGalaxy' => $r['homeGalaxy'], 
						'star' => $r['star'],
						'description' => $r['planetDesc']
					);
					
					array_push($rows,$planet);
				
				} // end while
				
				print json_encode($rows);
			}
		}else{
			// your going to have to know what table you should select from
			//$query = 'SELECT * FROM Planets WHERE planetName = "' . $selected . '";' ;
			$query = '
					SELECT
						planetName,
						planetDesc,
						planetType,
						planetTypeDesc,
						Planets.homeGalaxy,
						galaxyType,
						galaxyDesc,
						star,
						starType,
						starDesc
					FROM Planets
					INNER JOIN PlanetType ON planetType = planetTypeName
					INNER JOIN Galaxies ON homeGalaxy = galaxyName
					INNER JOIN GalaxyType ON galaxyType = galaxyTypeName
					INNER JOIN Stars ON star = starName
					INNER JOIN starType ON starType = starTypeName
					WHERE planetName = "' . $selected . '";' ;
			
			if($result = mysql_query($query)){
				$row = mysql_fetch_assoc($result);
				print json_encode($row);
			}else{
				print 'error';
				print $query;
			}
		}
	}
	
	
	if(isset($_GET['galaxy'])){
			
		$selected = $_GET['galaxy'];
		
		$query = " 
			SELECT *
			FROM Galaxies
			INNER JOIN GalaxyType ON galaxyType = galaxyTypeName 
			WHERE galaxyName = '" . $selected ."';";
			
		if($result = mysql_query($query)){
			$row = mysql_fetch_assoc($result);
			print json_encode($row);
		}else{
			print 'error';
			print $query;
		}
	}
	


?>
