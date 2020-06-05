const Discord = require('discord.js');

exports.run = (client, message, member) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  message.delete()
  const embed2 = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setTitle('Botun Yapımcısı')
  .setDescription(`Herhangi Bir Sorununuz Veya Öneriniz Olursa Ulaşabilirsiniz.** \n 🧾 **<@676916504528158721>`)
  .setFooter("Mert Kaleli © 2020")
  message.channel.send(embed2);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'dev',
  description: 'Botun Developerini Gösterir',
  usage: 'dev'
};