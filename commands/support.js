// * Description: The support
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'support',
	description: 'Determine the ways to receive support for the bot!',
	category: 'information',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let supportEmbed = new EmbedBuilder()
      .setTitle("Receiving Support")
      .setDescription("It looks like you need some help! Here are some ways to get support for the bot!")
      .setColor("#87CEEB")
      .setFields([
        {name: "Support Server", value: `The most efficient way to receive support is by joining the [support server](https://discord.gg/2nDJmR98nY).`, inline: false},
        {name: "Email", value: `If you do not have a Discord Account, you could receive support by emailing [support@egretdevelopment.com](mailto:support@egretdevelopment.com). Please state you are asking about TheArcher and your question with the email!`, inline: true}
      ])
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [supportEmbed] });
	},
	options: {},
};