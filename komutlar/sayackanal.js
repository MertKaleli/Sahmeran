const Discord = require('discord.js');
const db = require('quick.db');


exports.run = (client,message,args) => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

const kanal = message.mentions.channels.first() || args.slice(0).join(' ')
if(!kanal) return message.channel.send('Lütfen bir kanal etiketle.')


db.set(`sayaçkanal_${message.guild.id}`, kanal.id)
db.set(`sayaçaktif_${message.guild.id}`, "aktif")
message.channel.send(`Kanal başarıyla ${kanal} olarak ayarlandı.`)
}

exports.conf = {
enabled: true,
guildOnly: false,
permLevel: 2,
aliases: []
}

exports.help = {
name: 'ssk'
}