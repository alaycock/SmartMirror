function updateTime() {
	var n = new Date();
	
	
	var hh = n.getHours();
	var mm = n.getMinutes();
	var period = "AM";
	
	if(hh >= 12) {
		hh = hh-12;
		period = "PM";
	}
	if(hh == 0)
		hh = 12;
		
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
	$("#today .description").text(res.currently);
	$("#today .now").html(res.temp + "<sup>&deg;" + res.units.temp + "</sup>");
	$("#today .high").html(res.high);
	$("#today .low").html(res.low);
	
	for(var i = 0; i < res.forecast.length; i++) {
		var item = res.forecast[i];
		var forecastItem = $("#forecastItem.hidden").clone().removeClass("hidden");
		$("#forecast").append(forecastItem);
		forecastItem.find("i").addClass("wi " + codeIcon[item.code]);
		forecastItem.find(".high").text(item.high);
		forecastItem.find(".low").text(item.low);
		forecastItem.find(".day").text(item.day[0]);
	}
	
	console.log(res);
}

// Constructor 
$(document).ready(function() { 
	setInterval(updateTime, 1000);
	setInterval(updateWeather, 300000);
	updateTime();
	updateWeather();
});