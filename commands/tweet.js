// * Description: The ping command
const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const actionBuilder = require("../classes/actionBuilder");
const fetch = require("node-fetch");
const { errorEmbed } = require("../utils/helperFunctions");


module.exports = {
	name: 'tweet',
	description: 'Create a twitter post!',
	category: 'fun',
	production: true,
	publish: true,
	async execute(interaction, client) {
    let private = interaction.options.getBoolean("private")
    private = private== undefined ? true : private;
    let displayname = interaction.options.getString("displayname")
    displayname = displayname == undefined ? client.user.username : displayname;
    let username = interaction.options.getString("username")
    username = username == undefined ? client.user.username.toLowerCase() : username.toLowerCase();
    let comment = interaction.options.getString("comment")
    let avatar = interaction.options.getString("avatar")
    avatar = avatar == undefined ? client.user.displayAvatarURL({ format: "png" }).split('.') : avatar;
    if(typeof avatar == "object"){
      avatar[avatar.length - 1] = "png"
      avatar = avatar.join(".")
    }
    if(!isUrlAbsolute(avatar)){
      let error = errorEmbed("Invalid avatar URL", client);
      await interaction.reply({ embeds: [error] });
      return
    }
    let isIMAGE = await isImgUrl(avatar)
    if(!isIMAGE){
      let error = errorEmbed("avatar is not an image!!", client);
      await interaction.reply({ embeds: [error] });
      return
    }
    let url = `https://some-random-api.ml/canvas/misc/tweet?avatar=${encodeURI(avatar)}&comment=${comment}&displayname=${displayname}&username=${username}`;
    let tweetEmbed = new EmbedBuilder()
      .setTitle("Tweet!")
      .setColor("#87CEEB")
      .setDescription("If Image is not loading, click [here](" + encodeURI(url) + ")")
      .setImage(encodeURI(url))
      .setFooter({ text: `Powered by The Archer`, iconURL: client.user.avatarURL() });
		await interaction.reply({ embeds: [tweetEmbed], ephemeral: private }).catch(e => console.log(e.rawError.errors.data));
	},
	options: {
    inputOptions: [
      {
        type: "string",
        callback: (options) => {
          return options.setName("comment").setDescription("The content of the twitter avatar!").setRequired(true)
        }
      },
      {
        type: "boolean",
        callback: (options) => {
          return options.setName("private").setDescription("Whether or not I should reply ephemeral to you!")
        }
      },
      {
        type: "string",
        callback: (options) => {
          return options.setName("displayname").setDescription("The Display Name of the twitter user!").setRequired(false)
        }
      },
      {
        type: "string",
        callback: (options) => {
          return options.setName("username").setDescription("The twitter @handle of the twitter user!").setRequired(false)
        }
      },
      {
        type: "string",
        callback: (options) => {
          return options.setName("avatar").setDescription("The twitter avatar of the twitter user!").setRequired(false)
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