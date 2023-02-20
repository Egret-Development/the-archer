// * Discription: The main file of the bot. This file is the entry point of the bot.

// * Library Dependencies Declarations
const { Client, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// * Local File Dependencies Declarations
const config = require('./env.json');

// * Utils Declarations

// * Classes Declarations
const Command = require('./classes/commands.js');

// * Library setups
// Discord.js
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
exports.client = client;

// Define commands
client.applicationCommands = [];
client.guildCommands = [];
fs.readdir(path.join(__dirname, './commands'), (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		file = require('./commands/' + file);
		if (file.publish == true) {
			if (file.production == true) {
				client.applicationCommands.push(new Command(client, file.name, file.description, file.category, file.production, file.publish, file.execute, file.options).build()['slashCommandOptions']);
			}
			else if (file.production == false) {
				client.guildCommands.push(new Command(client, file.name, file.description, file.category, file.production, file.publish, file.execute, file.options).build()['slashCommandOptions']);
			}
		}
	});
	// require('./utils/helperFunctions.js')['updateGuildCommand'](client.guildCommands);
	// require('./utils/helperFunctions.js')['updateCommand'](client.applicationCommands);

});

// * Event Listeners
// Returns when bot is ready
client.on(Events.ClientReady, () => {
	// logs to console that bot is ready for use
	console.log(`Logged in as ${client.user.tag}!`);
});

// * Bot Login
client.login(config['DISCORD_TOKEN']);