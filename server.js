// todo:
// Routing for restarting the application, look into using nodemon for auto-restart
// Make the page I want to serve
//  - RSS feed
//  - Weather
//  - Time

var connect = require('connect');
var connectRoute = require('connect-route');
var serveStatic = require('serve-static');
var request = require('request');
var app = connect();

var newsConfig = {
	url: "http://rss.cbc.ca/lineup/topstories.xml"
};

// Serve static files
app.use(serveStatic(__dirname + "/public"));

// For dynamic page

app.use("/feed", connectRoute(function (router) {
	router.get('/', function(req, res, next) {
		request(newsConfig.url, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
				res.write(body);
				res.end();
		  }
		});
	});
}));

app.listen(8080);
