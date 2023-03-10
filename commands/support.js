// * Description: The support
const { EmbedBuilder, ButtonBuilder } = require("discord.js");
const actionBuilder = require("../classes/actionBuilder.js");

module.exports = {
	name: 'support',
	description: 'Determine the ways to receive support for the bot!',
	category: 'botinfo',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let builder = new actionBuilder(client);
    let serverButton = new ButtonBuilder()
      .setURL("https://discord.gg/CsWYJENUha")
      .setLabel('Discord Support Server')
      .setStyle(builder.buttonStyle.Link);
    let action = builder
      .addComponent(serverButton)
      .build();
    let supportEmbed = new EmbedBuilder()
      .setTitle("Receiving Support")
      .setDescription("It looks like you need some help! Here are some ways to get support for the bot!")
      .setColor("#87CEEB")
      .setFields([
        {name: "Support Server", value: `The most efficient way to receive support is by joining the support server using the respective button below this embed.`, inline: false},
        {name: "Email", value: `If you do not have a Discord Account, you could receive support by emailing [support@egretdevelopment.com](mailto:support@egretdevelopment.com). Please state you are asking about TheArcher and your question with the email!`, inline: true}
      ])
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [supportEmbed], components: [action] });
	},
	options: {},
};