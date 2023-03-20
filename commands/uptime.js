// * Description: The uptime command
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'uptime',
	description: 'Information on how long the bot has been up!',
	category: 'botinfo',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let uptime = client.uptime;
    let uptimeEmbed = new EmbedBuilder()
      .setTitle("The Archer Uptime")
      .setColor("#87CEEB")
      .setDescription(`The Archer has been up for \`${msToTime(uptime)}\`, or since <t:${Math.floor(Math.abs((Date.now()/1000) - (uptime/1000)))}>!`)
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [uptimeEmbed] });
	},
	options: {},
};

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + " hours, " + minutes + " minutes, and " + seconds + " seconds";
}