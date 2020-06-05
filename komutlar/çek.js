const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json')
exports.run = async (client ,message ,args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


const id = args[0]
if (!id)
return message.reply("HEY ! ÜYELERİN GİDECEĞİ VEYA GELECEĞİ KANALIN ID SİNİ YAZMAYI UNUTMA ;)")
message.guild.members.cache.filter(c => c.type === 'voice').forEach(x => x.voice.setChannel(id))
message.channel.send(`Bütün Sesli Kanaldaki Üyeler <#${id}> İsimli Odaya Taşındı! `)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['herkesi-taşı'],
  permLevel: 0
};
exports.help = {
  name: "çek"
};