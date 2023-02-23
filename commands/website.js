// * Description: The website command
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'website',
	description: 'Returns the website for the bot! This is where the dashboard is located!',
	category: 'information',
	production: true,
	publish: true,
	async execute(interaction) {
    let websiteEmbed = new EmbedBuilder()
      .setTitle("The Archer Official Website")
      .setColor("#87CEEB")
      .setDescription("To access the dashboard, or to learn more about the bot, visit the website [here](https://archer.egretdevelopment.com)")
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [websiteEmbed] });
	},
	options: {},
};