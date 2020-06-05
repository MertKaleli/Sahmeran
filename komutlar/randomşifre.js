const Discord = require('discord.js');
const client = new Discord.Client();
var randomstring = require('randomstring');

exports.run = (client, message) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  const embed = new Discord.MessageEmbed()
  .setAuthor(message.author.username + " Şifren Oluşturuldu", client.user.avatarURL)
  .setColor(0xD97634)
  .setDescription("Şifren: " + randomstring.generate({
    length: 12,
    charset: 'alphabetic'
}))
     message.author.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['p'],
  permLevel: 0
};

exports.help = {
  name: 'randomşifre',
  description: 'randomşifre gösterir.',
  usage: 'randomşifre'
};
