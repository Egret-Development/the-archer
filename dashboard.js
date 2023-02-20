// * Description: This file is used for initializing the dashboard

// * Import Modules
const express = require('express'),
	app = express();

// setting view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('./views'));

// route for index page
app.get('/', function(req, res) {
	res.render('index');
});

// route for support page
app.get('/support', function(req, res) {
	res.status(308).redirect('https://discord.gg/2nDJmR98nY');
});

// route for invite page
app.get('/invite', function(req, res) {
	res.status(308).redirect('https://discord.com/api/oauth2/authorize?client_id=1076722106684952616&permissions=1642691165303&scope=bot%20applications.commands');
});


app.listen(80, function() {
	console.log('Server is running on port 80 ');
});