const Discord = require ("discord.js");

exports.run = (client, message) => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
  
  var embed = new Discord.MessageEmbed()
  
  .setColor(Math.floor(Math.random()*16777215))
  .setDescription(`Artık Kral Oldun!`)
  .setImage(`https://media.giphy.com/media/3o7btXkbsV26U95Uly/source.gif`)
  
  message.channel.send(embed)
  
}
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  kategori: "",
  permLevel: 0
};

module.exports.help = {
  name: 'kralol',
  description: '',
  usage: 'kralol'
};