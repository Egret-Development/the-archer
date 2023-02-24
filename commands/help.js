// * Description: The ping command
const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const actionBuilder = require("../classes/actionBuilder");


module.exports = {
	name: 'help',
	description: 'Receive help on all the commands!!',
	category: 'information',
	production: false,
	publish: true,
	async execute(interaction, client) {
    let builder = new actionBuilder(client, async (interaction) => {
      let category = interaction.customId.split(".")[1]
        let categoryHelpEmbed = new EmbedBuilder()
          .setTitle("Help!")
          .setColor("#87CEEB")
          .setDescription("Select a category below to view the commands in that category!")
          .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL(), ephemeral: true });
        let commands = []
        for(i in client.commands) {
          if(client.commands[i].category == category) commands.push({ name: client.commands[i].name, value: client.commands[i].description })
        }
        categoryHelpEmbed.setFields(commands)
        await interaction.reply({ embeds: [categoryHelpEmbed], components: [], ephemeral: true });
    
    })


    let commands = client.commands
    
    
    let used = []
    for(i in commands) {
      if(used.includes(commands[i].category)) continue;
      used.push(commands[i].category)
      let button = new ButtonBuilder()
        .setCustomId("help." + commands[i].category)
        .setLabel(commands[i].category)
        .setStyle(builder.buttonStyle.Primary);
      builder.addComponent(button)
    }
    let pingEmbed = new EmbedBuilder()
      .setTitle("Help!")
      .setColor("#87CEEB")
      .setDescription("Select a category below to view the commands in that category!")
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [pingEmbed], components: [builder.build()], ephemeral: true });
	},
	options: {},
};