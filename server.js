// todo:
// Routing for restarting the application, look into using nodemon for auto-restart
// Make the page I want to serve
//  - RSS feed
//  - Weather
//  - Time
//  - Unread emails

var connect = require('connect');
var connectRoute = require('connect-route');
var serveStatic = require('serve-static');

// Serve static files
var app = connect().use(serveStatic(__dirname + "/public"));

// For dynamic pages
app.use(connectRoute(function (router) {
	router.get('/', function(req, res, next) {
		console.log("Page hit");
		res.end();
	});
}));

app.listen(8080);
