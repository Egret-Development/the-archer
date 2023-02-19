// * Description: This file is used to handle building slash commands

/**
* Load inputs into the slash command
* @date 2023-02-18
* @param { Array } options The options of the slash command
* @param { Object } data The data of the slash command builder
*/
exports.loadSlashCommandInputs = function(options, data) {
	for (let i in options) {
		options[i]['type'] = options[i]['type'].toLowerCase();
		if (!(options[i]['callback'] instanceof Function)) throw new TypeError('Type of inputOptions.callback must be a function.');
		if (options[i]['type'] == 'attachment') {
			data.addAttachmentOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'boolean') {
			data.addBooleanOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'channel') {
			data.addChannelOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'integer') {
			data.addIntegerOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'mentionable') {
			data.addMentionableOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'number') {
			data.addNumberOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'role') {
			data.addRoleOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'string') {
			data.addStringOption((option) => options[i]['callback'](option));
			continue;
		}
		if (options[i]['type'] == 'user') {
			data.addUserOption((option) => options[i]['callback'](option));
			continue;
		}
		throw new TypeError('Type of inputOptions.type must be a valid type.');
	}
};