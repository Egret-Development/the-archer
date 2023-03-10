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

class Bot{
  constructor(){
    // * Library setups
    // Discord.js
    this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

    // Define commands
    this.client.applicationCommands = [];
    this.client.commands = [];
    this.client.guildCommands = [];
    fs.readdir(path.join(__dirname, './commands'), (err, files) => {
      if (err) return console.error(err);
      files.forEach(file => {
        file = require('./commands/' + file);
        if (file.publish == true) {
          if (file.production == true) {
            let push = new Command(this.client, file.name, file.description, file.category, file.production, file.publish, file.execute, file.options);
            this.client.applicationCommands.push(push.build()['slashCommandOptions']);
            this.client.commands.push(push)
          }
          else if (file.production == false) {
            this.client.guildCommands.push(new Command(this.client, file.name, file.description, file.category, file.production, file.publish, file.execute, file.options).build()['slashCommandOptions']);
          }
        }
      });
      // console.log(this.client.applicationCommands);
      // require('./utils/helperFunctions.js')['removeGuildCommand'](this.client.guildCommands);
      // require('./utils/helperFunctions.js')['removeCommand'](this.client.applicationCommands);
      // require('./utils/helperFunctions.js')['publishGuildCommand'](this.client.guildCommands);
      // require('./utils/helperFunctions.js')['publishCommand'](this.client.applicationCommands);
    });

    // * Event Listeners
    // Returns when bot is ready
    this.client.on(Events.ClientReady, () => {
      // logs to console that bot is ready for use
      console.log(`Logged in as ${this.client.user.tag}!`);
      let command = this.client.applicationCommands;
      this.client.user.setPresence({ activities: [{ name: "/" + command[Math.floor(Math.random() * command.length)]['name'] }] })
      setInterval(() => {
      let commands = this.client.applicationCommands;
      this.client.user.setPresence({ activities: [{ name: "/" + commands[Math.floor(Math.random() * commands.length)]['name'] }] })
      }, 30000);
    });
  }


  // * Functions
  login(){
    this.client.login(config['DISCORD_TOKEN']);
  }
}


module.exports = Bot;