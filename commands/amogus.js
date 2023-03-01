// * Description: The ping command
const { EmbedBuilder } = require("discord.js");
let config = require("../env.json")
const { errorEmbed } = require("../utils/helperFunctions");

module.exports = {
	name: 'amogus',
	description: 'Someone is not the imposter!',
	category: 'fun',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let private = interaction.options.getBoolean("private")
    private = private== undefined ? true : private;
    let name = interaction.options.getString("name")
    name = name == undefined ? interaction.user.username : name;
    let avatar = interaction.options.getString("avatar")
    avatar = avatar == undefined ? "https://static.wikia.nocookie.net/dbxfanon/images/c/cc/The_Impostor.png/revision/latest" : avatar;
    if(!isUrlAbsolute(avatar)){
      let error = errorEmbed("Invalid avatar URL", client);
      await interaction.reply({ embeds: [error] });
      return
    }
    let isIMAGE = isImgUrl(avatar)
    if(!isIMAGE){
      let error = errorEmbed("avatar is not an image!!", client);
      await interaction.reply({ embeds: [error] });
      return
    }
    let url = `https://some-random-api.ml/premium/amongus?key=${config["SOME_RANDOM_API_KEY"]}&username=${name}&avatar=${avatar}`;
    let amogusEmbed = new EmbedBuilder()
      .setTitle("Amogus!")
      .setColor("#87CEEB")
      .setDescription("If Image is not loading/playing, click [here](" + encodeURI(url) + ")")
      .setImage(encodeURI(url))
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [amogusEmbed], ephemeral: private }).catch(e => console.log(e.rawError.errors.data));
	},
	options: {
    inputOptions: [
      {
        type: "boolean",
        callback: (options) => {
          return options.setName("private").setDescription("Whether or not I should reply ephemeral to you!").setRequired(false);
        }
      },
      {
        type: "string",
        callback: (options) => {
          return options.setName("name").setDescription("The name to include in the amogus meme!").setRequired(false);
        }
      },
      {
        type: "string",
        callback: (options) => {
          return options.setName("avatar").setDescription("The avatar url to include in the amogus meme").setRequired(false);
        }
      }
    ]
  },
};

async function isImgUrl(url) {
  if (url.toLowerCase().includes(".png") || url.toLowerCase().includes(".jpg") || url.toLowerCase().includes(".jpeg")) return true;
  return false;
}

function isUrlAbsolute(url) {
  if (url.indexOf('//') === 0) {return true;} // URL is protocol-relative (= absolute)
  if (url.indexOf('://') === -1) {return false;} // URL has no protocol (= relative)
  if (url.indexOf('.') === -1) {return false;} // URL does not contain a dot, i.e. no TLD (= relative, possibly REST)
  if (url.indexOf('/') === -1) {return false;} // URL does not contain a single slash (= relative)
  if (url.indexOf(':') > url.indexOf('/')) {return false;} // The first colon comes after the first slash (= relative)
  if (url.indexOf('://') < url.indexOf('.')) {return true;} // Protocol is defined before first dot (= absolute)
  return false; // Anything else must be relative
}