var calendarEvents = {};

var finishedUpdating = 0;

function updateCalendar() {
  weatherConfig.success = calendarWeather;
  $.simpleWeather(weatherConfig);
}

function calendarWeather(res) {
  var cal = $('#calendar');
  var rows = cal.find('.dateRow');
  var date = new Date();

  for (var i = 0; i < rows.length; i++) {
    event_row = $(rows[i]);

    event_row.find('.day').text(week[date.getDay()]);
    event_row.find('i').addClass("wi wi-yahoo-" + res.forecast[i].code);
    event_row.find('.temp').text(res.forecast[i].high + ' / ' + res.forecast[i].low);
    event_row.find('.events');

    date.setDate(date.getDate() + 1);
  }
}

function updateEvents() {
  finishedUpdating = 0;

  var events = $('#calendar .dateRow .events');
  for (var i = 0; i < events.length; i++) {
    console.log('emptying')
    $(events[i]).empty();
  }

  for (var k in calendarIds) {
    if (calendarIds.hasOwnProperty(k)) {
      $.get("/cal?id=" + calendarIds[k], addEvents(k));
    }
  }
}

function addEvents(id) {
  return function(data) {
    calendarEvents[id] = data;

    if (++finishedUpdating === Object.keys(calendarIds).length)
      drawEvents();
  }
}

function drawEvents() {
  var allEvents = [];
  for (var k in calendarEvents) {
    if (calendarEvents.hasOwnProperty(k)) {
      for (var i = 0; i < calendarEvents[k].length; i++) {
        calendarEvents[k][i].calendar = k;
      }
      Array.prototype.push.apply(allEvents, calendarEvents[k]);
    }
  }
  allEvents.sort(function(a, b) {
    b.start.dateTime = b.start.dateTime || b.start.date;
    a.start.dateTime = a.start.dateTime || a.start.date;
    return new Date(a.start.dateTime) - new Date(b.start.dateTime);
  });

  console.log(allEvents)

  var dayCounter = new Date();
  var dayIndex = 0;
  var cal = $('#calendar');
  var rows = cal.find('.dateRow');
  var endDate = new Date();
  endDate.setDate(endDate.getDate() + 5);

  var eventIndex = 0;
  while (eventIndex < allEvents.length && dayCounter < endDate) {
    var event = allEvents[eventIndex];
    if (dayCounter.getDate() !== (new Date(event.start.dateTime)).getDate()) {
      dayCounter.setDate(dayCounter.getDate() + 1);
      dayIndex++;
    } else {
      $(rows[dayIndex]).find('.events').append("<li><strong>" + event.calendar + "</strong> - " + event.summary + "</li>");
      eventIndex++;
    }
  }

}

$(document).ready(function() {
  // setInterval(updateCalendar, 60000);
  updateEvents();

  updateCalendar();
});
