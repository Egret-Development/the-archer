// * Description: The ping command

module.exports = {
	name: 'ping',
	description: 'Ping!',
	category: 'information',
	production: false,
	publish: true,
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
	options: {},
};