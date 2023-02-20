// * Description: This file is used for initializing the dashboard

// * Import Modules
const express = require('express'),
	app = express();
const axios = require('axios');
const qs = require('qs');
const config = require('./env.json');


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

// route for redirect
app.get('/invite', function(req, res) {
	res.status(308).redirect('https://discord.com/api/oauth2/authorize?client_id=1076722106684952616&permissions=1642691165303&scope=bot%20applications.commands');
});

// route for login page
app.get('/login', function(req, res) {
	res.status(308).redirect('https://discord.com/api/oauth2/authorize?client_id=1076722106684952616&redirect_uri=https%3A%2F%2Farcher.egretdevelopment.com%2Fredirect&response_type=code&scope=identify%20guilds');
});

// route for redirect
app.get('/redirect', async function(req, res) {
	const code = req.query.code;
	res.send(exchangeCode(code));
});

async function exchangeCode(code) {
	let data = qs.stringify({
		'client_id': config['clientId'],
		'client_secret': config['clientSecret'],
		'grant_type': 'authorization_code',
		'code': code,
		'redirect_uri': config['redirectURL'],
	});
	let payload = {
		method: 'post',
		url: 'https://discord.com/api/v10/oauth2/token',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data : data,
	};
	let token;
	try {
		token = await axios(payload);
	}
	catch (e) {
		console.error(e);
	}
	return token;

}

app.listen(80, function() {
	console.log('Server is running on port 80 ');
});