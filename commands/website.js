// * Description: The website command

module.exports = {
	name: 'website',
	description: 'Returns the website for the bot! This is where the dashboard is located!',
	category: 'information',
	production: false,
	publish: true,
	async execute(interaction) {
		await interaction.reply('Access the dashboard with this link: https://archer.egretdevelopment.com');
	},
	options: {},
};