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
	if(hh < 10)
		hh = "0" + hh;
	if(mm < 10)
		mm = "0" + mm;


	$("#time").text(hh + ":" + mm);
	$("#period").text(period);
	$("#date").text(week[n.getDay()] + ", " + month[n.getMonth()] + " " + n.getDate() + " " + n.getFullYear());
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

function updateNews() {
	$.ajax({
	  url: newsConfig.url, //document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(FEED_URL),
	  dataType: 'jsonp',
	  success: function (data) {
			console.log(data)
	    if (data.responseData.feed && data.responseData.feed.entries) {

	      $.each(data.responseData.feed.entries, function (i, e) {
	        console.log("------------------------");
	        console.log("title      : " + e.title);
	        console.log("author     : " + e.author);
	        console.log("description: " + e.description);
	      });
	    }
	  }
	});

}

// Constructor
$(document).ready(function() {
	setInterval(updateTime, 1000);
	setInterval(updateWeather, 300000);
	updateNews();
	updateTime();
	updateWeather();
});
