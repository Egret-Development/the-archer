// * Description: The website command
const { EmbedBuilder } = require("discord.js");
const actionBuilder = require("../classes/actionBuilder.js");

module.exports = {
	name: 'website',
	description: 'Returns the website for the bot! This is where the dashboard is located!',
	category: 'information',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let builder = new actionBuilder();
    let button = builder.buttonBuilder
      .setURL("https://archer.egretdevelopment.com")
      .setLabel('Website')
      .setStyle(builder.buttonStyle.Link);
    let action = builder
      .addComponent(button)
      .build();
    let websiteEmbed = new EmbedBuilder()
      .setTitle("The Archer Official Website")
      .setColor("#87CEEB")
      .setDescription("To access the dashboard, or to learn more about the bot, visit the website by clicking the respective button below!")
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [websiteEmbed], components: [action] });
	},
	options: {},
};