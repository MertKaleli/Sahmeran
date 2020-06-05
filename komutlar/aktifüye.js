const Discord = require('discord.js');
exports.run = (client, message, args) => { 

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
  
  let code = message.guild.members.cache.filter(m => m.presence.status !== "offline").size
  
    const embed = new Discord.MessageEmbed()
    .setTitle("Sunucudaki Aktif Üyeler")
    .setDescription('**' + message.guild.name + '** Sunucusunda şu anda toplam **' + code + '** Aktif üye bulunuyor!')
    .setColor(Math.floor(Math.random()*16777215))
    message.channel.send(embed)  
  
  };
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: [], 
  permLevel: 0
};

exports.help = {
  name: 'aktifüye',
  description: 'Sunucudaki Aktif Üyeleri Gösterir', 
  usage: 'aktifüye'
};