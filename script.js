// Month variables
var JAN=0,FEB=1,MAR=2,APR=3,MAY=4,JUN=5,JUL=6,AUG=7,SEP=8,OCT=9,NOV=10,DEC=11;

// SETTING VARIABLES HERE! 	  YEAR, MON, DAY, 	HR(12), PM?, 	MIN
var streamStartEST = makeDate(2017, FEB, 9, 	5,		true,	15);
var streamEndEST   = makeDate(2017, FEB, 9,		5,		true,	20);
// END SETTINGS

$(document).ready(function(){
	$("header").load("header.html");
	$(".sidebar").load("sidebar.html", function(){
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
	$("footer").load("footer.html");
});

function makeDate(year, month, day, hour, isPM, minute){
	if(isPM) hour += 12;
	return new Date(year, month, day, hour, minute, 0, 0);
}