// ==UserScript==
// @name        gc_log
// @namespace   gc_log
// @include     https://www.geocaching.com/*
// @require     https://momentjs.com/downloads/moment.min.js
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
	//See if we got some speciel parameters
	var type = getURLParameter("type");
	var date = getURLParameter("date");
	var comment = getURLParameter("comment");

	//If comments are null set to empty string, then we don't have to check for null everywhere
	if(comment==null) comment="";

	//If the parameters are not there return
	if(date==null || type==null) return;

	//Get the current URL
	var URL = window.location.href;

	//Check if we are on a geocache site
	if(URL.includes("/geocache/")){
		//Get an element that only exsist if the cache is logged
		var element = $("#ctl00_ContentBody_GeoNav_logText");
		

		//If we already found the cache
		if(element.html()=="Found It!"){
			//Close tab
			window.close();
		}
		//Get the logbutton
		var log_button = $("#ctl00_ContentBody_GeoNav_logButton");

		//Get url from logbutton
		var url = log_button.attr("href");

		//If we have a did not find log and haven't logged it yet
		if(type=="did not find" && element.html()!="Did Not Find"){
			//Open a log tab
			GM_openInTab("http://geocaching.com/"+url+"&type="+type+"&date="+date+"&comment="+comment);
		}
		else{
/*
			//If comment contains V\space or is just V
			if(comment.substring(0,2)=="V " || comment=="V"){
				//Open a maintenance wet log
				GM_openInTab("http://geocaching.com/"+url+"&type=maintenance&date="+date+"&comment=wet");

				//Remove maintenance info from comment
				if(comment="V") comment="";
				else comment=comment.substring(2,comment.length);
			}
			//If comment contains L\space or is just L
			else if(comment.substring(0,2)="L " || comment=="L"){
				//Open a maintenance logbook log
				GM_openInTab("http://geocaching.com/"+url+"&type=maintenance&date="+date+"&comment=logbook");

				//Remove maintenance info from comment
				if(comment="L") comment="";
				else comment=comment.substring(2,comment.length);
			}*/

			//Open a new tab for logging
			GM_openInTab("http://geocaching.com/"+url+"&type="+type+"&date="+date+"&comment="+comment);
		}
	}
	//Check if we are on a log site
	else if(URL.includes("/seek/log")){

		//Get parameters
		var type= getURLParameter("type");
		var date= getURLParameter("date");
		var comment= getURLParameter("comment");
		comment=comment.replace("\\n","\n");

		//If comment is null set it to TFTC!
		if(comment==null) comment="TFTC!";

		//Return if some of paramters are null
		if(date==null || type==null || comment==null) return;

		//Get the logtype option
		var logtype = $("#ctl00_ContentBody_LogBookPanel1_ddLogType");

		//Remove current option selection
		logtype.val("-1").removeAttr("selected");

		//If it's a found log
		if(type=="found it"){

			//Select it
			logtype.val("2").attr("selected","selected");
		}
		//Or if it's a maintenance log
		else if(type=="maintenance"){

			//Select it
			logtype.val("45").attr("selected","selected");

			//And set log to the appropriate message
			if(comment=="logbook") comment= "Logbook is full :-)";
			else if(comment=="wet") comment= "Logbook is wet :-)";
		}

		//Create a moment object from data
		date= moment(date.split("T")[0]);
		//Make a date String
		var dateString= date.format("MM/DD/YYYY");

		//Set the date
		var dateField= document.getElementById("uxDateVisited");
		dateField.setAttribute("value",dateString);

		//Get the textField
		var textField = $("#ctl00_ContentBody_LogBookPanel1_uxLogInfo");

		//Set the logText
		textField.html(comment);
	}
})();
