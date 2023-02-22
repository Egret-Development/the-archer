// * Description: This file is used for initializing the dashboard

// * Import Modules
const https = require("https");
const express = require('express'),
	app = express();
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const config = require('./env.json');
const cookieParser = require('cookie-parser');
const { PermissionsBitField } = require('discord.js');
let Bot = require('./bot.js');
const rateLimit = require('express-rate-limit')
var cors = require('cors')

let bot = new Bot();
bot.login();

// setting view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('./views'));
app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true)
  res.header('SameSite', 'None')
  next();
});
app.use(cookieParser());
app.use((req, res, next) => {
  const { headers: { cookie } } = req;
  if (cookie) {
      const values = cookie.split(';').reduce((res, item) => {
          const data = item.trim().split('=');
          return { ...res, [data[0]]: data[1] };
      }, {});
      res.locals.cookie = values;
  }
  else res.locals.cookie = {};
  next();
});
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: config.FRONTEND_URL ?? "http://localhost:80",
  optionsSuccessStatus: 200,
}))


// route for index page
app.get('/', function(req, res) {
	res.render('index');
});

// route for support page
app.get('/support', function(req, res) {
	res.redirect('https://discord.gg/2nDJmR98nY');
});
// route for redirect
app.get('/invite', function(req, res) {
	let extra = '';
	if(req.query.server) extra += '&guild_id=' + req.query.server;
	res.redirect('https://discord.com/api/oauth2/authorize?client_id=1076722106684952616&permissions=' + config.normalPermissions + '&redirect_uri=https%3A%2F%2Farcher.egretdevelopment.com%2Fredirect&response_type=code&scope=bot%20identify%20applications.commands%20guilds' + extra);
});

// route for login page
app.get('/login', function(req, res) {
	let cookies = req.cookies;
	if(!cookies['userData'] || !cookies['tokenData']) {
		res.redirect('https://discord.com/api/oauth2/authorize?client_id=1076722106684952616&redirect_uri=https%3A%2F%2Farcher.egretdevelopment.com%2Fredirect&response_type=code&scope=identify%20guilds');
	}else{
		res.redirect('/dashboard');
	}
});

// route for redirect
app.get('/redirect', async function(req, res) {
    const code = req.query.code;
    let token = await exchangeCode(code);
    if (token.status != 200) return res.redirect('/logout');
    token = JSON.parse(token.data);
    let data = await login(res, token);
    if(data.status == 200) res.cookie('userData', JSON.stringify(data.userData), data.options).cookie('tokenData', JSON.stringify(token), data.options).cookie('guilds', JSON.stringify(data.guilds), data.options).redirect('/dashboard');
});

async function login(res, token) {
	let identity = await getIdentity(res, token.access_token);
  console.log(identity)
  if(identity.status != 200) return { status: 500 };
  
  identity = identity.data;
	let options = {
		maxAge: (1000 * token.expires_in) - 10000,
		httpOnly: false,
    sameSite: 'none',
    secure: true
	};
  let data = await getGuilds(res, token.access_token);
  console.log(data)
  if(data.status != 200) return { status: 500 };
  data = data.data
	token['expires_at'] = (Date.now() + options.maxAge);
	return { status: 200, options: options, userData: identity, guilds: data };
}

// route for logout
app.get('/logout', function(req, res) {
	res.clearCookie('userData');
	res.clearCookie('tokenData');
	res.clearCookie('guilds');
	res.redirect('/');
});
// route for logout
app.get('/dashboard/logout', function(req, res) {
	res.clearCookie('userData');
	res.clearCookie('tokenData');
	res.clearCookie('guilds');
	res.redirect('/');
});

// route for dashboard
app.get('/dashboard', async function(req, res) {
  console.log(req.cookies)
  try{
	if (isMalFormed(req.cookies.tokenData) || isMalFormed(req.cookies.userData) || isMalFormed(req.cookies.guilds)) {
		return res.redirect('/logout');
	}
	let tokenData = JSON.parse(req.cookies['tokenData']);
	if(Math.abs(tokenData['expires_at'] - Date.now()) < (1000 * 60 * 60 * 24)) {
		let newToken = await refreshCode(res, tokenData['refresh_token'])
		if(!newToken) return;
    let data = await login(res, newToken);
    if(data.status == 200) res.cookie('userData', JSON.stringify(data.userData), data.options).cookie('tokenData', JSON.stringify(token), data.options).cookie('guilds', JSON.stringify(data.guilds), data.options).redirect('/dashboard');
};
	let username = JSON.parse(req.cookies['userData']);
  let guilds = JSON.parse(req.cookies['guilds']);
  console.log(guilds[0])
	if(!guilds) return res.redirect("./logout");
  let client = bot.client;
	let botGuilds = client.guilds.cache.map(guild => guild.id);
	let guildsData = '';
	for (let i in guilds) {
		let permissions = new PermissionsBitField(guilds[i]['permissions']);
		let title;
		let color;
		if (!permissions.has('ManageGuild') && !permissions.has('Administrator')) continue;
		if (botGuilds.includes(guilds[i]['id'])) {
			title = 'The Archer is in this server';
			color = 'primary';
		} else {
			title = 'The Archer is not in this server';
			color = 'danger';
		}
		guildsData += '<div onclick="window.location.href=\'/server?guild=' + guilds[i]['id'] + '\'" class="col-md-6 col-xl-3 mb-4"><div class="card shadow border-start-primary py-2"><div class="card-body"><div class="row align-items-center no-gutters"><div class="col me-2"><div class="text-uppercase text-' + color + ' fw-bold text-xs mb-1"><span>' + title + '</span></div><div class="text-dark fw-bold h5 mb-0"><span>' + guilds[i]['name'] + '</span></div></div><div class="col-auto"><i class="fas fa-server fa-2x text-gray-300"></i></div></div></div></div></div>';
	}
	res.render('dashboard/index', { username: username.username, guilds: guildsData });
}catch(err){
  console.log(err);
}
});

// Server Route
app.get('/server', async function(req, res) {
	if (!req.cookies['userData'] || JSON.parse(req.cookies['userData']).username == undefined || JSON.parse(req.cookies['userData']).avatar == undefined || JSON.parse(req.cookies['userData']).id == undefined) {
		return res.redirect('/login');
	}
	if(!req.query.guild) return res.redirect('/dashboard');
	let guild = req.query.guild;
	let botGuilds = client.guilds.cache.map(guild => guild.id);
	if(!botGuilds.includes(guild)) return res.redirect('/invite?server=' + guild);

})

function isMalFormed(json){
  let malformed = false;
  try{
    JSON.parse(json)
    malformed = false;
  }catch(e) {
    malformed = true;
  }
  return malformed;
}

// Clear Cookies Route
app.post('/clear', function(req, res) {
  try{
    if(req.cookies[req.body.name] == undefined){
      res.status(404).json({ status: 'Cookie already deleted!' })
    }else{
      res.clearCookie(req.body.name);
      res.status(200).json({ status: 'success' })
    }
  }
  catch(e){
    console.error(e)
    res.status(500).json(JSON.parse(JSON.stringify(e)))
  }
});

async function getGuilds(res, token) {
	const payload = {
		method: 'get',
		url: 'https://discord.com/api/v10/users/@me/guilds',
		headers: {
			'Authorization': 'Bearer ' + token,
		},
	};
	let guilds;
	try {
		const temp = await axios(payload);
		guilds = temp.data;
    return { status: 200, data: JSON.stringify(guilds)};
	}
	catch (e) {
		e = JSON.stringify(e);
		return { status: 500, data: e };
  }
}

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
	try {
		const temp = await axios(payload);
		return { status: 200, data: JSON.stringify(temp.data) };
	}
	catch (e) {
		return { status: 500, data: JSON.stringify(e) };
	}

}

async function refreshCode(res, code) {
	let data = qs.stringify({
		'client_id': config['clientId'],
		'client_secret': config['clientSecret'],
		'grant_type': 'refresh_token',
		'refresh_token': code,
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
		const temp = await axios(payload);
		token = JSON.stringify(temp.data);
	}
	catch (e) {
		e = JSON.stringify(e);
		// res.send('First, Check if the error contains any messages that might suggest the source of the error(the error code usually is http error code, which could lead to clues), then try deleting the cookies and reload. If this does not resolve after that, please contact our support with the following information: <br /><br />' + e)
	}
	return token;

}

async function getIdentity(res, token) {
	const payload = {
		method: 'get',
		url: 'https://discord.com/api/v10/users/@me',
		headers: {
			'Authorization': 'Bearer ' + token,
		},
	};
	let identity;
	try {
		const temp = await axios(payload);
		return {status:200, data: JSON.stringify(temp.data)};
	}
	catch (e) {
		e = JSON.stringify(e);
    return { status: 500, data: e };
		// res.send('First, Check if the error contains any messages that might suggest the source of the error(the error code usually is http error code, which could lead to clues), then try deleting the cookies and reload. If this does not resolve after that, please contact our support with the following information: <br /><br />' + e)
	
  }
}

// https
//   .createServer(
// 		// Provide the private and public key to the server by reading each
// 		// file's content with the readFileSync() method.
//     {
//       key: fs.readFileSync(__dirname + "/private.pem"),
//       cert: fs.readFileSync(__dirname + "/public.pem"),
//     },
//     app
//   )
//   .listen(80, () => {
//     console.log("serever is runing at port 4000");
//   });

app.listen(80, () => {
  console.log('Server is running at port 80');
});