// Month variables
var months = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};

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

		$.get("./livestream.txt", function(data){
			var config = JSON.parse(data);
			
			var streamStartEST = makeDate(config.startDate);
			var streamEndEST = makeDate(config.endDate);

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
	});
	$("footer").load("footer.html");
});

function makeDate(config){
	var hour = config.hour;
	if(config.pm == true) hour += 12;
	return new Date(config.year, months[config.month], config.day, hour, config.min, 0, 0);
}