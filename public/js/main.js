function updateTime() {
	var n = new Date();
	
	
	var hh = n.getHours();
	var mm = n.getMinutes();
	var period = "AM";
	
	if(hh >= 12) {
		hh = hh-12;
		period = "PM";
	}
		
	if(mm < 10)
		mm = "0" + mm;
	
	$("#time").text(hh + ":" + mm);
	$("#period").text(period);
	$("#date").text(month[n.getMonth()] + " " + n.getDate());
	$("#year").text(n.getFullYear());
}

function updateWeather() {
	// Simple Weather JS:
	// http://simpleweatherjs.com/
	// Yahoo weather codes:
	// https://developer.yahoo.com/weather/documentation.html#codes
	// Weather icons:
	// http://erikflowers.github.io/weather-icons/
	
	weatherConfig.success = successfulWeather;
	$.simpleWeather(weatherConfig);
}

function successfulWeather(res) {
	$("#today i").addClass("wi " + codeIcon[res.code]);
	console.log(res);
}

// Constructor 
$(document).ready(function() { 
	setInterval(updateTime, 1000);
	updateTime();
	updateWeather();
});