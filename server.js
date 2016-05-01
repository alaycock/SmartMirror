var config = require('./config');
var express = require('express')
var session = require('express-session');
var request = require('request');
var calRoute = require('./routes/calendar.js');

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

// Calendar stuff

app.all('/cal', calRoute);

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
