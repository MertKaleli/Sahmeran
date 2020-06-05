const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require('quick.db');

exports.run = async(client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  let code = message
  let afkk = args.slice(0).join(' ')
  if(!afkk) return code.channel.send("Lütfen bir sebep belirt")
  db.set(`codeaaktif_${code.author.id}`, "aktif")

  code.channel.send("Başarıyla **"+afkk+"** sebebiyle AFK durumundasın")
  code.member.setNickname(`AFK | ${code.author.username}`);
  db.set(`codeafk_${code.author.id}`, afkk)

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'afk',
    description: 'AFK Moduna Geçersiniz',
    usage: ''
  };