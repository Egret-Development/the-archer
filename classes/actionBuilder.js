const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = class actionBuilder{
  #buttons = [];
  constructor(client, callback){
    this.actions = new ActionRowBuilder();
    this.buttonStyle = ButtonStyle;
    client.on(Events.InteractionCreate, interaction => {
      if (!interaction.isButton()) return;
      if(!this.#buttons.includes(interaction.customId)) return;
      callback(interaction);
    });
  }
  addComponent(data){
    this.#buttons.push(data.data['custom_id'])
    this.actions.addComponents(data);
    return this;
  }
  build(){
    return this.actions;
  }
}