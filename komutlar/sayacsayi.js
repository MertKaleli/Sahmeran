const Discord = require('discord.js');
const db = require('quick.db');

exports.run = (client,message,args) => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    let deneme = args.slice(0).join(' ');

const sa = new Discord.MessageEmbed()
.setColor(Math.floor(Math.random()*16777215))
.setDescription(`Geçerli bir sayaç sayısı belirtmelisin. \`!ss <sayı> #Kanal\``)

const sa1 = new Discord.MessageEmbed()
.setColor(Math.floor(Math.random()*16777215))
.setDescription(`Sunucudaki kullanıcı Sayısı: ${message.guild.members.cache.size} Bu Değerden Daha Yüksek Bir Değer Girmelisin.`)
if(!deneme) return message.channel.send('Lütfen bir sayı yaz!')

	if(isNaN(deneme)) return message.channel.send(sa);

if(deneme <= message.guild.members.cache.size) return message.channel.send(sa1);

db.set(`sayaçsayı_${message.guild.id}`, deneme)
message.channel.send(`Başarıyla sayaç sayı ${deneme} olarak ayarlandı.`)	
}


exports.conf = {
enabled: true,
guildOnly: false,
permLevel: 2,
aliases: []
}

exports.help = {
name: 'ss'
}