const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = class actionBuilder{
  constructor(){
    this.actions = new ActionRowBuilder();
    this.buttonBuilder = new ButtonBuilder();
    this.buttonStyle = ButtonStyle;
  }
  addComponent(data){
    this.actions.addComponents(data);
    return this;
  }
  build(){
    return this.actions;
  }
}