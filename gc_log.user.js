// ==UserScript==
// @name        gc_log
// @namespace   gc_log
// @include     https://www.geocaching.com/*
// @require     http://momentjs.com/downloads/moment.min.js
// @version     0.1.0
// @grant       GM_openInTab
// @unwrap
// ==/UserScript==
(function(){

	// List of all the Geocaches to log
	var logs = [];

	//Log text on cache page
	var logtext= "TFTC!";


	//Make button to activate the script
	var input=document.createElement("input");
	input.type="button";
	input.value="Log Caches!";
	input.onclick = openCaches;

	//Append to the site
	document.body.appendChild(input); 

	//Function to iterate through list of geocaches and open them in tab
	function openCaches(){
		for(var i =0; i<logs.length;i++){
			var url= "http://www.geocaching.com/geocache/"+logs[i].geocode;
			GM_openInTab(url);
		}
	}

	//Magic function to get URL parameters
	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
	}

	//Hash table to look up geocodes
	var table= {};

	//File the hash table. Key is geocode, value is date
	for(var i=0;i<logs.length;i++){
		table[logs[i].geocode]=new moment(logs[i].time);
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
		//Get the logbutton
		var element = document.getElementById('ctl00_ContentBody_GeoNav_logButton');

		//Get the cache name
		var el= document.getElementById("ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode");
		var gcCode= el.textContent;

		//Get url from logbutton
		var url = element.getAttribute("href");

		//Open a new tab for logging
		GM_openInTab("http://geocaching.com/"+url+"&gcCode="+gcCode);
	}
	//Check if we are on a log site
	else if(URL.includes("/seek/log")){

		//Get the logtype option
		var logtype = document.getElementById("ctl00_ContentBody_LogBookPanel1_ddLogType");

		//Set it to found
		logtype.options[0].removeAttribute("selected");
		logtype.options[1].setAttribute("selected","selected");

		//Get the GC code from the URL
		var gcCode=getURLParameter("gcCode");

		//Lookup the date in our hashtable
		var date= table[gcCode];

		//If it doesnt exsist quit
		if(date==undefined) return;

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
