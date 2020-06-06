const Discord = require('discord.js');
const db = require('quick.db')
exports.run = async(client, message, args) => { 
  
  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  const embed1 = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setAuthor("Güvenlik Sistemi")
  .setDescription("Hesap Güvenliği Sistemi Devredışı Bırakıldı!")
  .setFooter(client.user.username + " | Tarafından Devredışı Bırakıldı")
  .setTimestamp()

  
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":x: Bu komutu kullanmak için yeterli yetkiye sahip değilsin.");
  
  let ana_veri = await db.fetch(`codeming_${message.guild.id}`)

  
  if(ana_veri) {
    
message.channel.send(embed1)  
    
db.delete(`codeming_${message.guild.id}`)       
    return
  }
 if(!ana_veri) {
   
   db.set(`codeming_${message.guild.id}`, "aktif")
 
   const embed2 = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setAuthor("Güvenlik Sistemi")
  .setDescription("Hesap Güvenliği Sistemi Aktifleştirildi!\nSunucuya Gelen Üyelerin Hesapları En Az 14 Günlük Olması Gerekmektedir.\n")
  .setFooter(client.user.username + " | Tarafından Aktifleştirildi")
  .setTimestamp()

 message.channel.send(embed2)  
 
 const embed3 = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setAuthor("Güvenlik Sistemi")
  .setDescription("Hesap Güvenliği Sistemi <@" + client.user.id + "> Tarafından Aktif Hale Getirildi!")
  .setTimestamp()

   
 message.guild.owner.send(embed3)  

 } 

  };
exports.conf = {
  enabled: true,  
  guildOnly: false, 
  aliases: ["gs"], 
  permLevel: 0
};

exports.help = {
  name: 'güvenliksistemi',
  description: 'taslak', 
  usage: 'gs'
};