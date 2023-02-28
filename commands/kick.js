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
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
    if(!interaction.guild.members.cache.get(target.id).kickable){
      let error = errorEmbed("I cannot kick this user!", client);
      await interaction.reply({ embeds: [error] });
      return
    }

		await interaction.reply(`Kicking ${target.username} for reason: ${reason}`);
    const kick = await interaction.guild.members.kick(target, reason);
    let kickEmbed = new EmbedBuilder()
      .setTitle("Kicked " + target.tag + "!")
      .setColor("#87CEEB")
      .setFields([
        {name: "Reason", value: reason, inline: false}
      ])
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
      let kickNotifEmbed = new EmbedBuilder()
        .setTitle("You have been kicked from " + interaction.guild.name + "!")
        .setColor("#87CEEB")
        .setFields([
          {name: "Reason", value: reason, inline: false}
        ])
        .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
    client.users.cache.get(target.id).send({ embeds: [kickNotifEmbed] }).catch(() => {});
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