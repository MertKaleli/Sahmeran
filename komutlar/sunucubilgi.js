const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

exports.run = (client, message, params) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    let saski = message.guild.createdAt.toString().split(' ')

   const embed = new Discord.MessageEmbed()
   .setColor(Math.floor(Math.random()*16777215))
   .setAuthor(message.guild.name, message.guild.userURL)
   .setThumbnail(message.guild.iconURL)
   .addField('Bölge:', message.guild.region, true)
   .addField('Sahibi:', message.guild.owner, true)
   .addField('Doğrulama Seviyesi:', message.guild.verificationLevel, true)
   .addField('Üye:', `${message.guild.members.cache.filter( member => member.user.bot).size} Bot | ${message.guild.memberCount} Üye`, true)
   .addField('Kanal:', `${message.guild.channels.cache.filter(chan => chan.type === 'voice').size} Sesli / ${message.guild.channels.cache.filter(chan => chan.type === 'text').size} Yazı`, true)
   .addField('Oluşturma tarihi:', saski[2] + " " + saski[1].replace('Jan', 'Ocak').replace('Feb', 'Şubat').replace('Mar', 'Mart').replace('Apr', 'Nisan').replace('May', 'Mayıs').replace('Jun', 'Haziran').replace('July', 'Temmuz').replace('Aug', 'Ağustos').replace('Sep', 'Eylül').replace('Oct', 'Ekim').replace('Nov', 'Kasım').replace('Dec', 'Aralık').split() + " " + saski[3], true)
   .setFooter(`© Şahmeran Bot Tüm hakları saklıdır. `, message.guild.iconURL)
   .setTimestamp()
   message.channel.send({embed})
 };

 exports.conf = {
   enabled: true,
   guildOnly: false,
   aliases: ["sb"],
   permLevel: 2
 };

 exports.help = {
   name: 'sunucubilgi',
   description: 'Sunucu bilgisini söyler.',
   usage: 'sunucubilgi'
 };
