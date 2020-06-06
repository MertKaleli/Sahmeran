const Discord = require('discord.js');
exports.run = (client, message, args) => { 

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
  
  let code = message.guild.members.cache.size
  
    const embed = new Discord.MessageEmbed()
    .setTitle("Sunucuda Bulunan Üyeler")
    .setDescription('**' + message.guild.name + '** Sunucusunda Şuanda Toplam **' + code + '** Üye Bulunuyor!')
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
  name: 'toplamüye',
  description: '', 
  usage: 'toplamüye'
};