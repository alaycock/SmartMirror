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
	$(".today i").removeClass().addClass("wi wi-yahoo-" + res.code);
	$(".today .description").text(res.currently);
	$(".today .now").html(res.temp + "<sup>&deg;" + res.units.temp + "</sup>");
	$(".today .high").html(res.high);
	$(".today .low").html(res.low);

	$(".forecast").empty();

	for(var i = 0; i < res.forecast.length; i++) {
		var item = res.forecast[i];
		var forecastItem = $(".forecastItem.hidden").clone().removeClass("hidden");
		$(".forecast").append(forecastItem);
		forecastItem.find("i").addClass("wi wi-yahoo-" + res.code);
		forecastItem.find(".high").text(item.high);
		forecastItem.find(".low").text(item.low);
		forecastItem.find(".day").text(item.day[0]);
	}
}

function updateNews() {
	$.get("/feed", function (data) {
		$("#news .newsContainer").empty();

		var items = $(data).find("item");
		items.sort(function(a,b) {
			var dateA = new Date($(a).find("pubdate").text());
			var dateB = new Date($(b).find("pubdate").text());
			return dateB - dateA;
		});

		for(var i = 0; i < items.length && i < 5; i++) {
			var el = $(items[i]);
			var title = el.find("title").text().slice(9);
			title = title.substring(0, title.length - 3);
			time = new Date(el.find("pubdate").text());

			var hh = time.getHours();
			var mm = time.getMinutes();
			var period = "AM";

			if(hh >= 12) {
				hh = hh-12;
				period = "PM";
			}
			if(hh == 0)
				hh = 12;
			if(mm < 10)
				mm = "0" + mm;

			var newsItem = $("#news .newsItem.hidden").clone().removeClass("hidden");
			$("#news .newsContainer").append(newsItem);
			newsItem.find(".title").text(title);
			newsItem.find(".time").text(hh + ":" + mm + " " + period)
		}
	});
}

function keypressInit() {
	$(document).keydown(function(e) {
		var y = $(window).scrollTop();  //your current y position on the page
		var height = $('.page').height();
    switch(e.which) {
        case 38: // up
					$("html, body").animate({ scrollTop: roundToMultiple(y - height, height) }, 1000);
        break;

        case 40: // down
					$("html, body").animate({ scrollTop: roundToMultiple(y + height, height) }, 1000);
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
	});
}

function roundToMultiple(n, multiple) {
	return Math.round(n/multiple) * multiple;
}

// Constructor
$(document).ready(function() {
	setInterval(updateTime, 1000);
	setInterval(updateWeather, 300000);
	setInterval(updateNews, 300000);

	updateTime();
	updateWeather();
	updateNews();
	keypressInit();

	// Scroll to the dashboard by default
	$(document).ready(function() {
    $(document).scrollTop($('#dashboard').offset().top);
	});

	// Scroll news feed
	setInterval(function() {
		$("#news .newsItem:first-child").animate({
				left: '-50%'
		}, 800, function() {
			$(this).css('left', '150%');
			$(this).appendTo('#news .newsContainer');
		});

		$("#news .newsItem:first-child").next().animate({
				left: '50%'
		}, 800);
	}, 7000);


});
