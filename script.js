// Month variables
var JAN=0,FEB=1,MAR=2,APR=3,MAY=4,JUN=5,JUL=6,AUG=7,SEP=8,OCT=9,NOV=10,DEC=11,SEC=0,MILI=0;
// SETTING VARIABLES HERE! 		YEAR, MON, DAY, HOUR(24), MIN, 	SEC, MILLI
var streamStartEST = new Date(	2017, FEB, 8, 	16, 	  10, 	SEC, MILI);
var streamEndEST = new Date(	2017, FEB, 9, 	16, 	  10, 	SEC, MILI);
// END SETTINGS

$(document).ready(function(){
	$("header").load("header.html");
	$(".sidebar").load("sidebar.html");
	$("footer").load("footer.html");

	// BASE SETTINGS
	var notLivePrompt = document.getElementById("notlivePrompt");
	var livePrompt = document.getElementById("livePrompt");
	// END BASE SETTINGS

	// Code to display live or not live!
	var oDate = new Date();
	var local = oDate.getTime();
	var localOffset = oDate.getTimezoneOffset() * 60000;

	var utc = local + localOffset;
	var estOffset = -5 * 3600000;
	var est = utc + estOffset;

	var date = new Date(est);

	// Determine if we need to show live or not live
	if(date >= streamStartEST && date < streamEndEST){
		// Live
		notLivePrompt.style.display = "none";
		livePrompt.style.display = "inline";
	}else{
		// Not Live
		notLivePrompt.style.display = "inline";
		livePrompt.style.display = "none";
	}
});
