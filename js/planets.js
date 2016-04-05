/** 
 * Written by: John Mezzanotte
 * planets.js
 * Date created: 1-18-2016
 */

function getXMLHttpRequestObject(){
	
	'use strict'; 
	
	var ajax = null;
	
	if(window.XMLHttpRequest){
		ajax = new XMLHttpRequest();
	}else if (window.ActiveXObject){ // handle older IE
		ajax = new ActiveXObject('MSXML2.XMLHTTP>3.0');
	}
	
	return ajax;
	
}


/**
 * Makes an AJAX call to the php resource planetdata.php. That php script requests all available planet names 
 * from the database as a JSON object. We then use this JSON object to create a dropdown menu.
 * @param id
 * 	
 */
function showMenu(id){
	
	'use strict';
	
	var ajax = getXMLHttpRequestObject(); 
	var menu = U.$('menu');
	
	// create select menu
	var select = document.createElement('select');
	select.id = id;
	select.style.visibility = 'hidden';
	menu.appendChild(select);
	
	// remove any existing elements
	while(select.firstChild){
		select.removeChild(select.firstChild); 
	}
	
	var url = "http://localhost/midterm2/planets/resources/planetdata.php?menu=" + id;
	ajax.open('GET', url, true);
	ajax.send(null);
	
	ajax.onreadystatechange = function(){
		if(ajax.readyState == 4){
			// check the server status code as well 
			if((ajax.status >= 200 && ajax.status < 300 ) ||
					(ajax.status == 304)){
				console.log(ajax.reponseText);
				var data = JSON.parse(ajax.responseText); 
				
				if (data){
					
					select.style.visibility = 'visible';
					
					for(var i = 0; i < data.length; i++){
						var opt = document.createElement('option');
						opt.text = opt.value = data[i];
					    select.appendChild(opt);
					}
				}else{
					select.style.visibility = 'hidden';
				}	
			}else{
				console.log("status: " + ajax.statusText);
			}	
		} // end if
	} // end onreadystatechange
} // end showMenu


function displayPlanet(){
	
	'use strict'; 
	
	var planets = U.$('planets');
	var ajax = getXMLHttpRequestObject();

	var choice = planets.value;
	
	var url = "http://localhost/midterm2/planets/resources/planetdata.php?planet=" + choice;
	
	ajax.open('GET', url, true); 
	ajax.send(null); 
	
	ajax.onreadystatechange = function(){
		if(ajax.readyState == 4){
			// check the server status code as well 
			if((ajax.status >= 200 && ajax.status < 300 ) ||
					(ajax.status == 304)){
				
				console.log(ajax.responseText);
				var data = JSON.parse(ajax.responseText);
				
				if(choice == 'Select'){
					// drop the source attribute to hide the image
					
					U.removeNode('galaxies');
					enableDetailPanel(false, false, false);
					
					removeContent(U.$('main-image'));
					
				}else if(choice == 'Galaxies'){
					
					showMenu('galaxies');
					U.addEvent(U.$('galaxies'), 'change', displayGalaxy);
					removeContent(U.$('main-image'));
					enableDetailPanel(false, false, false)
					
				}else{
					
					// set main content
					U.setText('header', data.planetName);
					U.setText('output', data.planetDesc);
					displayImage(U.$('main-image'), 'images/' + data.planetName); 
				
					enableDetailPanel(true, true, true);
					// set details panel
					var detailsSettings = [
					                       {
					                    	   headerId   : 'detail-1-header',  
					                    	   headerVal  : 'Planet Type', 
					                    	   captionId  : 'detail-1-caption', 
					                    	   captionVal : data.planetType, 
					                    	   imgId	  : 'detail-1-img', 
					                    	   imgName    : data.planetType 
					                       }, 
					                       {
					                    	   
					                    	   headerId   : 'detail-2-header' , 
					                    	   headerVal  : 'Orbiting Star', 
					                    	   captionId  : 'detail-2-caption', 
					                    	   captionVal : data.star, 
					                    	   imgId	  : 'detail-2-img', 
					                    	   imgName    : data.star 
					                       },
					                       {
					                    	   headerId   : 'detail-3-header',
					                    	   headerVal  : 'Home Galaxy', 
					                    	   captionId  : 'detail-3-caption', 
					                    	   captionVal : data.homeGalaxy,
					                    	   imgId 	  : 'detail-3-img', 
					                    	   imgName    :  data.homeGalaxy   
					                       }					                       
					                     ];
					

					for(var i = 0; i < detailsSettings.length; i++){
						console.log('in the planets details loop');
						U.setText(detailsSettings[i].headerId, detailsSettings[i].headerVal);  
						U.setText(detailsSettings[i].captionId, detailsSettings[i].captionVal);
						displayImage(U.$(detailsSettings[i].imgId), 'images/' + detailsSettings[i].imgName); 
					}
	
					// set info window content
					var infoWindowSettings =  [
					                           {
					                        	   headerId  : 'more-info-1-header', 
					               			 	   headerVal : data.planetType, 
												   contentId : 'more-info-1-content', 
											 	   content   : data.planetTypeDesc  
					                           }, 
					                           {
					                        	   headerId  : 'more-info-2-header', 
					                        	   headerVal : data.star, 
					                        	   contentId : 'more-info-2-content',
					                        	   content 	 : data.starDesc
					                           }, 
					                           {
					                        	   headerId  : 'more-info-3-header', 
					                        	   headerVal : data.homeGalaxy, 
					                        	   contentId : 'more-info-3-content', 
					                        	   content   : data.galaxyDesc  
					                           }
					                         ];

					
					for(var i = 0; i < infoWindowSettings.length; i++ ){
						U.setText(infoWindowSettings[i].headerId, infoWindowSettings[i].headerVal); 
						U.setText(infoWindowSettings[i].contentId, infoWindowSettings[i].content); 
					}
					
					U.removeNode('galaxies'); // drop the galaxies menu
				}
			}
		}else{
			console.log("status: " + ajax.statusText);
		}	
	}
}



function displayGalaxy(){
	
	'use strict'; 

	var galaxy = U.$('galaxies').value;	
	var ajax = getXMLHttpRequestObject();
	var url = "http://localhost/midterm2/planets/resources/planetdata.php?galaxy=" + galaxy;
	
	ajax.open('GET', url, true); 
	ajax.send(null); 
	
	ajax.onreadystatechange = function(){
		if(ajax.readyState == 4){
			// check the server status code as well 
			if((ajax.status >= 200 && ajax.status < 300 ) ||
					(ajax.status == 304)){
				
				console.log(ajax.responseText);
				var data = JSON.parse(ajax.responseText);
				
				if(galaxy == 'Select'){

					// I added removeNode to the utilities object. I was repeating the code to much
					U.removeNode('galaxies');
					enableDetailPanel(false, false, false);
					removeContent(U.$('main-image'));
	
				}else{
					// set content
					U.setText('header', data.galaxyName);
					U.setText('output', data.galaxyDesc);
					displayImage(U.$('main-image'), 'images/' + data.galaxyName);
					
				
					var detailsSettings = [
					                       {
					                    	   headerId   : 'detail-1-header',  
					                    	   headerVal  : '', 
					                    	   captionId  : 'detail-1-caption', 
					                    	   captionVal : '', 
					                    	   imgId	  : null, 
					                    	   imgName    : '' 
					                       }, 
					                       {
					                    	   
					                    	   headerId   : 'detail-2-header' , 
					                    	   headerVal  : 'Galaxy Type', 
					                    	   captionId  : 'detail-2-caption', 
					                    	   captionVal : data.galaxyType, 
					                    	   imgId	  : 'detail-2-img', 
					                    	   imgName    : data.galaxyType
					                       },
					                       {
					                    	   headerId   : 'detail-3-header',
					                    	   headerVal  : '', 
					                    	   captionId  : 'detail-3-caption', 
					                    	   captionVal : '',
					                    	   imgId 	  : null, 
					                    	   imgName    :  ''
					                       }					                       
					                     ];
				
					for(var i = 0; i < detailsSettings.length; i++){
						U.setText(detailsSettings[i].headerId, detailsSettings[i].headerVal);
						U.setText(detailsSettings[i].captionId, detailsSettings[i].captionVal);
						displayImage(U.$(detailsSettings[i].imgId), 'images/' + detailsSettings[i].imgName); 
					}
					// details menu text
					enableDetailPanel(false, true, false);
					
					// set the info window
					U.setText('more-info-2-header',data.galaxyType);
					U.setText('more-info-2-content', data.galaxyDesc);
					
				}
			}
		}else{
			console.log("status: " + ajax.statusText);
		}	
	}
}

/**
 * Used to help with some clean-up tasks when presenting information to the users. 
 * The main tasks are making certain content invisible or removing content based on 
 * user choice.
 * @param image
 */
function removeContent(image){
	
	var details = U.$('details');
	var detailsImages = document.getElementsByClassName('detail-img');
	
	// create an arry to hold all images. Write one loop to do all clean-up
	var images = [];
	
	// Remove text content
	U.setText('output', ''); 
	U.setText('header', '');
	details.style.visibility ='hidden';
	
	// create images array
	for(var i=0; i < detailsImages.length; i++){
		images.push(detailsImages[i]);
	}

	images.push(image);
	
	// remove and hide all images
	for(var i=0; i < images.length; i++){
		console.log(images[i]);
		images[i].style.visibility = 'hidden';
		images[i].removeAttribute('src');
	}
}

function enableDetailPanel(detail1Enable, detail2Enable, detail3Enable){
	
	'use strict';
	
	//U.$('details').style.visibility ='visible';
	
	if(detail1Enable){
		U.$('detail-1').style.visibility = 'visible'; 
		U.$('detail-1-header').style.visibility = 'visible';
		U.$('detail-1-caption').style.visibility = 'visible';
	}else{
		U.$('detail-1').style.visibility = 'hidden'; 
		U.$('detail-1-header').style.visibility = 'hidden';
		U.$('detail-1-caption').style.visibility = 'hidden';
	}
	
	if(detail2Enable){
		U.$('detail-2').style.visibility = 'visible'; 
		U.$('detail-2-header').style.visibility = 'visible';
		U.$('detail-2-caption').style.visibility = 'visible';
		
	}else{
		U.$('detail-2').style.visibility = 'hidden'; 
		U.$('detail-2-header').style.visibility = 'hidden';
		U.$('detail-2-caption').style.visibility = 'hidden';
	}
	
	if (detail3Enable){
		U.$('detail-3').style.visibility = 'visible'; 
		U.$('detail-3-header').style.visibility = 'visible';
		U.$('detail-3-caption').style.visibility = 'visible';
	}else{
		U.$('detail-3').style.visibility = 'hidden';
		U.$('detail-3-header').style.visibility = 'hidden';
		U.$('detail-3-caption').style.visibility = 'hidden';
	}	
}

function displayImage(img, imgName){
	
	'use strict';
	if(img != null && imgName != ''){
		img.style.visibility = 'visible'; 
		img.src = imgName + '.jpg';
	}
}


function displayInfoWindow(infoWindow){
	
	'use strict';
	
	infoWindow.style.visibility = 'visible';
}

function hideInfoWindow(infoWindow, timer){
	window.clearTimeout(timer);
	timer = setTimeout(function(){
		infoWindow.style.visibility = 'hidden';
	}, 2000) // 2 seconds
	
}

function enableInfoWindow(infoWindow, triggerElement, timer, posTop, posLeft){
	
	'use strict';
	
	// enable hover
	U.addEvent(infoWindow, 'mousedown', U.draggable.enableDrag);
	
	U.addEvent(triggerElement, 'mouseover', function(){
		displayInfoWindow(infoWindow);
	});
	
	U.addEvent(triggerElement, 'mouseout', function(){
		window.clearTimeout(timer);
		timer = setTimeout(function(){
			infoWindow.style.visibility = 'hidden';
		}, 2000) // 2 seconds
	});
	
	
	U.addEvent(infoWindow, 'mouseover', function(){
		window.clearTimeout(timer);
	});
	
	// ensure position
	infoWindow.style.top = posTop; 
	infoWindow.style.left = posLeft; 
}



window.onload = function(){
	
	var infoWindow1Timer = 0;
	var infoWindow2Timer = 0; 
	var infoWindow3Timer = 0;
	
	showMenu('planets');
	U.addEvent(U.$('planets'), 'change', displayPlanet); 

	enableInfoWindow(U.$('detail-1-more-info'), U.$('detail-1'), infoWindow1Timer, '650px', '100px');
	enableInfoWindow(U.$('detail-2-more-info'), U.$('detail-2'), infoWindow2Timer, '800px', '500px');
	enableInfoWindow(U.$('detail-3-more-info'), U.$('detail-3'), infoWindow3Timer, '670px', '900px');
	
	
}
