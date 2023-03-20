// * Description: The ban command
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { errorEmbed } = require("../utils/helperFunctions");

module.exports = {
	name: 'ban',
	description: 'Ban a member from the server!',
	category: 'moderation',
	production: true,
	publish: true,
	async execute(interaction, client) {
    const author = interaction.author
		const target = interaction.options.getUser('target');
		const time = interaction.options.getNumber('deletemessagesfor') ?? undefined;
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
    if(!interaction.guild.members.cache.get(target.id).bannable){
      let error = errorEmbed("I cannot ban this user!", client);
      await interaction.reply({ embeds: [error] });
      return
    }

		await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
    const ban = await interaction.guild.members.ban(target, { reason: reason, deleteMessageSeconds: time });
    let baninfo = ban.user?.tag ?? ban.tag ?? ban
    let banEmbed = new EmbedBuilder()
      .setTitle("Banned " + target.tag + "!")
      .setColor("#87CEEB")
      .setFields([
        {name: "Reason", value: reason, inline: false}
      ])
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.followUp({ embeds: [banEmbed] });
	},
	options: {
    inputOptions: [
      {
        "type": "user",
        "callback": (option) => {
          return option.setName("target").setDescription("The user to ban").setRequired(true);
        }
      },
      {
        "type": "number",
        "callback": (option) => {
          return option.setName("deletemessagesfor").setDescription("Number of **SECONDS** to delete the message for!").setRequired(false);
        }
      },
      {
        "type": "string",
        "callback": (option) => {
          return option.setName("reason").setDescription("Reason for the ban!").setRequired(false);
        }
      }
    ],
    "permissions": PermissionFlagsBits.BanMembers
  },
};