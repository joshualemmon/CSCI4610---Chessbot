var express = require("express");
var app = express();
app.use(express.static('public'));
// app.get('/', function(req, res) {
// 	res.sendFile('default.html', { root: __dirname + "/public/"});
// 	res.sendFile('default.js', { root: __dirname + "/public/"});
// });
var port = 3000;
app.listen(port, function() {
	console.log(__dirname + '/public');
	console.log('Listening on port: ' + port);
});