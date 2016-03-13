function updateCalendar() {
  weatherConfig.success = calendarWeather;
	$.simpleWeather(weatherConfig);
}

function calendarWeather(res) {
  var cal = $('#calendar');
  var rows = cal.find('.dateRow');
  var date = new Date();

  for(var i = 0; i < rows.length; i++) {
    event_row = $(rows[i]);

    event_row.find('.day').text(week[date.getDay()]);
    event_row.find('i').addClass("wi wi-yahoo-" + res.forecast[i].code);
    event_row.find('.temp').text(res.forecast[i].high + ' / ' + res.forecast[i].low);
    event_row.find('.events');

    date.setDate(date.getDate() + 1);
  }
}

$(document).ready(function() {
	// setInterval(updateCalendar, 1000);

	updateCalendar();
});
