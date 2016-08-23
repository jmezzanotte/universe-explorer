// Written-by : John Mezzanotte
// Date-created: 12-21-15

effects = {
		addEvent: function(obj, type, fn) {
	        'use strict';
	        
	        if (obj && obj.addEventListener) { // W3C
	            obj.addEventListener(type, fn, false);
	        } else if (obj && obj.attachEvent) { // Older IE
	            obj.attachEvent('on' + type, fn);
	        }
	    }, 
	    removeEvent: function(obj, type, fn) {
	        'use strict';
	        
	        if (obj && obj.removeEventListener) { // W3C
	            obj.removeEventListener(type, fn, false);
	        } else if (obj && obj.detachEvent) { // Older IE
	            obj.detachEvent('on' + type, fn);
	        }
	    },
		draggable : { // object to enable dragging of div
			// When creating a draggable element you have to make sure that you set that elements top and right 
			// position values within the css or else you get odd things that start to happen. 
			element : null,
			mouseStartY : 0, 
			mouseStartX : 0,
			offsetX : 0,
			offsetY : 0,
			scrollX: 0,
			scrollY: 0, 
			startZIndex : 0, 
			// drag functionality object 
			startDrag : function(e){
				
				'use strict'; 
				
				var elem = effects.draggable.element;
			
				if(typeof e == 'undefined') e = window.event;

				
				var currentScrollY = document.documentElement.scrollTop || document.body.scrollTop; 
				var currentScrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				if(e.touches){
					elem.style.left = ((effects.draggable.offsetX + currentScrollX) - effects.draggable.scrollX  +  e.touches[0].pageX - effects.draggable.mouseStartX) + 'px'; 
					elem.style.top =  ((effects.draggable.offsetY + currentScrollY) - effects.draggable.scrollY  +  e.touches[0].pageY - effects.draggable.mouseStartY) + 'px';
				}else{
					elem.style.left = ((effects.draggable.offsetX + currentScrollX) - effects.draggable.scrollX  +  e.clientX - effects.draggable.mouseStartX) + 'px'; 
					elem.style.top =  ((effects.draggable.offsetY + currentScrollY) - effects.draggable.scrollY  +  e.clientY - effects.draggable.mouseStartY) + 'px';
				}

			}, 
			stopDrag : function(){
				
				//var body = document.getElementsByTagName('body')[0];
				
				effects.removeEvent(document.documentElement, 'mousemove', effects.draggable.startDrag);
				effects.draggable.element.style.zIndex = effects.draggable.startZIndex; // return z-idex to original value
				effects.draggable.element = null;
				
			},
			enableDrag : function(e){
				
				if(e == 'undefined') e = window.event;
					
				var target = e.target || e.srcElement;
				
				// if e.button is dropped touch move works
				if(target.className == "drag") {
				//if(e.button == 0 && target.className == "drag") {
						
					effects.draggable.element = target;
					

					effects.addEvent(document.documentElement, 'mousemove', effects.draggable.startDrag);
					effects.addEvent(document.documentElement, 'touchmove', effects.draggable.startDrag);
					
					// crossbrowser way of getting coordinates
					// we also need to account for the scroll bar positions 
					if(e.clientX || e.clientY){
						// scroll bar position is different cross browser 
						effects.draggable.mouseStartY = e.clientY ; 
						effects.draggable.mouseStartX = e.clientX ;
					}else if(e.pageX || e.pageY){
						effects.draggable.mouseStartY = e.pageY;
						effects.draggable.mouseStartX = e.pageX;
							
					}else if (e.touches){
					
						effects.draggable.mouseStartY = e.touches[0].pageY;
						effects.draggable.mouseStartX = e.touches[0].pageX;
					}
					
					
					effects.draggable.offsetX = target.offsetLeft ; 
					effects.draggable.offsetY = target.offsetTop ;
					effects.draggable.startZIndex = target.style.zIndex;
					effects.draggable.scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
					effects.draggable.scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
					target.style.position = 'absolute'; 
					target.style.cursor = 'move';
					target.style.zIndex = 1000; //bring drag element to the front
					// this allows the drag element to follow the scrolling of the page
					// without it things get crazy 
					//target.style.position= 'fixed'; 
					effects.addEvent(effects.draggable.element, 'mouseup', effects.draggable.stopDrag);
						
				}
			} // end enableDrag 
	}, // end draggable object
	accordian : function(e){
		
		'use strict';
			
		var target = e.target || e.srcElement; 
			
		if(target.className=='accordian-init'){
				
			var accordianTarget = target.nextElementSibling;
			var inactiveIndex = accordianTarget.className.indexOf('inactive'); 
			var activeIndex = accordianTarget.className.indexOf(' active');

			if((inactiveIndex == -1) && (activeIndex == - 1)){
				accordianTarget.className += ' inactive'; 
			}else if((activeIndex == -1) && (inactiveIndex > -1)){
				accordianTarget.className += ' active';
			}else if((activeIndex > -1) && (inactiveIndex > -1 )){
				accordianTarget.className = accordianTarget.className.replace(' active', '');
			}	
		}
	}// end accordian
			
}