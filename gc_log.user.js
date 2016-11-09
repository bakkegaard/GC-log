// ==UserScript==
// @name        gc_log
// @namespace   gc_log
// @include     https://www.geocaching.com/*
// @require     http://momentjs.com/downloads/moment.min.js
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     0.1.0
// @grant       GM_openInTab
// @unwrap
// ==/UserScript==
(function(){

	//Log text on cache page
	var logtext= "TFTC!";

	//Magic function to get URL parameters
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}

	//Get the current URL
	var URL = window.location.href;
	
	//Check if we are on a geocache site
	if(URL.includes("/geocache/")){
		//Get an element that only exsist if the cache is logged
		var element = document.getElementById('ctl00_ContentBody_GeoNav_logText');
		//If the element is not undefined and the text is found close the window
		if(element!=undefined && element.textContent=="Found It!"){
			window.close(); //Close window
		}

		var type= getURLParameter("type");
		var date= getURLParameter("date");

		if(date==null || type==null) return;

		//Get the logbutton
		var element = document.getElementById('ctl00_ContentBody_GeoNav_logButton');

		//Get the cache name
		var el= document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode");
		var gcCode= el.textContent;

		//Get url from logbutton
		var url = element.getAttribute("href");

		//Open a new tab for logging
		GM_openInTab("http://geocaching.com/"+url+"&type="+type+"&date="+date);
	}
	//Check if we are on a log site
	else if(URL.includes("/seek/log")){

		//Get the logtype option
		var logtype = document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType");

		//Set it to found
		logtype.options[0].removeAttribute("selected");
		logtype.options[1].setAttribute("selected","selected");

		//Lookup the date in our hashtable
		var date= getURLParameter("date");

		//If it doesnt exsist quit
		if(date==undefined) return;

		date= moment(date);

		//Otherwise make the date string
		var dateString= (parseInt(date.month())+1)+"/"+ date.date()+"/"+date.year();

		//Set the date
		var dateField= document.getElementById("uxDateVisited");
		dateField.setAttribute("value",dateString);

		//Get the textField
		var textField = document.getElementById("ctl00_ContentBody_LogBookPanel1_uxLogInfo");

		//Set the logText
		textField.innerHTML=logtext;
	}})();
