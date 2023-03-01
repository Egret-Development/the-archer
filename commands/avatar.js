// * Description: The ping command
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'avatar',
	description: 'Send an avatar of a user!',
	category: 'information',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let user = interaction.options.getUser("user") || interaction.user;
    let pingEmbed = new EmbedBuilder()
      .setTitle("Avatar for " + user.username)
      .setColor("#87CEEB")
      .setImage(user.displayAvatarURL())
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [pingEmbed] });
	},
	options: {
    inputOptions: [
      {
        type: "user",
        callback: (options) => {
          return options.setName("user").setDescription("The user to get the avatar of!").setRequired(false);
        }
      }
    ]
  },
};