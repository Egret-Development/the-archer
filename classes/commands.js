// * Description: This file contains the command class

// * Importing Modules
const { SlashCommandBuilder, Client } = require('discord.js');


// * Exporting utils
const { loadSlashCommandInputs } = require('../utils/SlashCommandBuilding.js');

// * Command Class For Each Command

class Command {
	/**
  * The Commands Class
	* @param { Client } client The Discord Client
  * @param { String } name The name of the command
  * @param { String } description The description of the command
  * @param { String } category The category of the command
	* @param { Boolean } production Whether to deploy to production or not
	* @param { Boolean } publish Whether to publish the command or not
  * @param { Function } execute The function to be executed when the command is called
  * @param { Object } options The options of the command
	* @param { Array } options.inputOptions The input options of the command
	* @param { String } options.inputOptions.type The type of the input options
	* @param { Function } options.inputOptions.callback The callback function of the command, remember toreturn the value of options!
  */
	constructor(client, name, description, category, production, publish, execute, options = {}) {
		// * Checking if the parameters are of the correct type
		if (!(client instanceof Client)) throw new TypeError('client must be a Discord Client.');
		if (typeof name !== 'string') throw new TypeError('Command name must be a string.');
		if (typeof description !== 'string') throw new TypeError('Command description must be a string.');
		if (typeof category !== 'string') throw new TypeError('Command category must be a string.');
		if (typeof production !== 'boolean') throw new TypeError('Command production must be a boolean.');
		if (typeof publish !== 'boolean') throw new TypeError('Command publish must be a boolean.');
		if (!(execute instanceof Function)) throw new TypeError('Command execute must be a function.');
		if (options['inputOptions']) {
			if (!Array.isArray(options['inputOptions'])) throw new TypeError('InputOptions must be an array.');
			this.inputOptions = options['inputOptions'];
		}

		// * Setting the parameters to the class
		this.client = client;
		this.name = name;
		this.description = description;
		this.category = category;
		this.production = production;
		this.publish = publish;
		this.execute = execute;

		// * Neccessary Listeners
		client.on('interactionCreate', async (interaction) => {
			if (!interaction.isCommand()) return;
			if (interaction.commandName !== this.name) return;
			await this.execute(interaction);
		});
	}

	/**
  * Build the command for publishing
  */
	build() {
		let slashCommandOptions = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description);
		if (this.inputOptions) {
			loadSlashCommandInputs(this.inputOptions, slashCommandOptions);
		}
		const result = {
			slashCommandOptions: slashCommandOptions.toJSON(),
			production: this.production,
		};
		return result;
	}
}

module.exports = Command;