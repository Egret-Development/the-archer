// * Description: Helper functions for the application

// * Importing Modules
const { REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { clientId, guildId, DISCORD_TOKEN } = require('../env.json');


// * Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
// * Remove all guild command
exports.publishGuildCommand = async function(commands) {
	if (commands.length == 0) return;
	console.log(commands);
	try {
		console.log('Started publishing ' + commands.length + ' guild (/) commands.');

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log('Successfully published all ' + data.length + ' guild (/) commands.');
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};

// * Remove application commands
exports.publishCommand = async function(commands) {
	if (commands.length == 0) return;
	try {
		console.log('Started publishing ' + commands.length + ' application (/) commands.');

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		console.log('Successfully publishing ' + data.length + ' application (/) commands.');
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};



// * Remove all guild command
exports.removeGuildCommand = async function(commands) {
	try {
		console.log('Started removing ' + commands.length + ' guild (/) commands.');

		// The put method is used to fully refresh all commands in the guild with the current set
		let data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [] },
		);
		console.log('Successfully removed all ' + data.length + ' guild (/) commands.');
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};

// * Remove application commands
exports.removeCommand = async function(commands) {
	if (commands.length == 0) return;
	try {
		console.log('Started removing ' + commands.length + ' application (/) commands.');

		// The put method is used to fully refresh all commands in the guild with the current set
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: [] },
		);
		console.log('Successfully removing ' + data.length + ' application (/) commands.');
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};




exports.errorEmbed = function(description, client) {
  let embed = new EmbedBuilder()
    .setTitle('Error')
    .setDescription(description)
    .setColor("#FF0000")
    .setFooter({ text: "Powered by The Archer", iconURL: client.user.avatarURL() });
  return embed;
}