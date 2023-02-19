// * Description: Helper functions for the application

// * Importing Modules
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { clientId, guildId, DISCORD_TOKEN } = require('../env.json');


// * Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
// * Remove all guild command
exports.updateGuildCommand = async function(commands) {
	if (commands.length == 0) return;
	console.log(commands);
	try {
		console.log('Started removing ' + commands.length + ' guild (/) commands.');

		// The put method is used to fully refresh all commands in the guild with the current set
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [] },
		);
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		removeStorage('guildCommands');
		for (let i in commands) {
			addToStorage(commands[i].name, 'guildCommands');
		}
		console.log('Successfully removed all ' + data.length + ' guild (/) commands.');
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};

// * Remove application commands
exports.updateCommand = async function(commands) {
	if (commands.length == 0) return;
	try {
		console.log('Started removing ' + commands.length + ' application (/) commands.');

		// The put method is used to fully refresh all commands in the guild with the current set
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: [] },
		);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
		removeStorage('applicationCommands');
		for (let i in commands) {
			addToStorage(commands[i].name, 'applicationCommands');
		}
		console.log('Successfully removed ' + data.length + ' application (/) commands.');
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};


function addToStorage(command, type) {
	let storage = JSON.parse(fs.readFileSync(path.join(__dirname, '../publishedCommands.json'), 'utf8'));
	let temp = storage[type];
	if (!(temp.includes(command))) temp.push(command);
	storage[type] = temp;
	fs.writeFile(path.join(__dirname, '../publishedCommands.json'), JSON.stringify(storage, null, 2), (err) => {
		if (err) console.log(err);
	});
}

function removeStorage(type) {
	let storage = JSON.parse(fs.readFileSync(path.join(__dirname, '../publishedCommands.json'), 'utf8'));
	const commands = {
		guildCommands: type == 'guildCommands' ? [] : storage.guildCommands,
		applicationCommands: type == 'applicationCommands' ? [] : storage.applicationCommands,
	};
	fs.writeFile(path.join(__dirname, '../publishedCommands.json'), JSON.stringify(commands, null, 2), (err) => {
		if (err) console.log(err);
	});
}