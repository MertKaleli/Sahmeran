const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json')
const db = require('quick.db')

exports.run = (client, message, args) => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
    let kontrol = message.member.voice.channel
    if(!kontrol) return message.reply("Bir Ses Kanalında Olman Gerekiyor");

    message.member.voice.channel.join()
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['btgel'],
    permLevel: 4
}

exports.help = {
    name: 'botgel',
    description: '',
    usage: ''
}