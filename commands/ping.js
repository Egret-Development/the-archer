// * Description: The ping command
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'ping',
	description: 'Ping!',
	category: 'botinfo',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let pingEmbed = new EmbedBuilder()
      .setTitle("Ping!")
      .setColor("#87CEEB")
      .setFields([
        {name: "Client Ping", value: `${client.ws.ping}ms`, inline: true},
        {name: "Message Delay", value: `${Math.abs(interaction.createdAt - Date.now())}ms`, inline: true}
      ])
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [pingEmbed] });
	},
	options: {},
};