var config = require('./config');
var express = require('express')
var session = require('express-session');
var request = require('request');
var google = require('googleapis');
var calendar = google.calendar('v3');

var app = express();
var port = 8080;

// Alternates:
// http://www.huffingtonpost.ca/feeds/index.xml
// http://rss.cbc.ca/lineup/topstories.xml

var newsConfig = {
	url: "http://www.huffingtonpost.ca/feeds/index.xml"
};

// Your own super cool function
var logger = function(req, res, next) {
    console.log(req.method + " request to " + req.url);
    next();
}

app.all("*", logger);

app.use(express.static(__dirname + "/public"));
app.use(session({
  secret: config.session_secret,
  resave: true,
  saveUninitialized: true
}));

app.all('/cal', function(req, res){

  var key = config.google_key;
  var scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
  var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, scopes, null);

  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log(err);
      return;
    }

    // Make an authorized request to list Drive files.
    calendar.events.list(
      {auth: jwtClient, calendarId: 'adam.laycock@gmail.com'},
      function(err, resp) {
        res.write(JSON.stringify(err) + JSON.stringify(resp));
        res.end();
    });
  });
});

app.get('/feed', function(req, res) {
	request(newsConfig.url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			res.write(body);
			res.end();
	  }
	});
});

app.listen(port, function() {
  console.log("Server running on localhost:" + port)
});
