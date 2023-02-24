// * Description: The ping command
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { errorEmbed } = require("../utils/helperFunctions");

module.exports = {
	name: 'kick',
	description: 'Kick a member from the server!',
	category: 'moderation',
	production: true,
	publish: true,
	async execute(interaction, client) {
    const author = interaction.author
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const member = interaction.guild.members.cache.get(target.id);
    if(!member.kickable){
      let error = errorEmbed("You cannot kick this user!", client);
      await interaction.reply({ embeds: [error] });
      return
    }

		await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
		await member.kick(reason);
    let kickEmbed = new EmbedBuilder()
      .setTitle("Kicked " + target.tag + "!")
      .setColor("#87CEEB")
      .setFields([
        {name: "Reason", value: reason, inline: false}
      ])
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.followUp({ embeds: [kickEmbed] });
	},
	options: {
    inputOptions: [
      {
        "type": "user",
        "callback": (option) => {
          return option.setName("target").setDescription("The user to kick").setRequired(true);
        }
      },
      {
        "type": "string",
        "callback": (option) => {
          return option.setName("reason").setDescription("Reason for the kick!").setRequired(false);
        }
      }
    ],
    "permissions": PermissionFlagsBits.KickMembers
  },
};