const Discord = require('discord.js');
const db = require('quick.db')
exports.run = (client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.reply("Bu Komutu Burada Kullanamazsın!")

  message.delete()
  let guild = message.guild
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();

  let gonder = db.fetch(`kanalslar_${message.guild.id}`)
  let aktif = db.fetch(`kanalslars_${message.guild.id}`)

  let modlog = guild.channels.cache.find(z => z.id === gonder);
  if (!modlog) return message.reply("Modlog Kanalı Ayarlamanız Gerekmektedir!");
  if (!reason) return message.reply('**Uyarı Sebebi Belirtmen Gerekli!**');
  if (!user) return message.reply('**Bir Kişi Belirtmelisin!**')

  const embed2 = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setDescription("Merhaba <@" + user.id +"> `" + reason + "` Sebebiyle Uyarıldın!")
  user.send(embed2)

if (aktif == "aktif") {

  const embed = new Discord.MessageEmbed()
  .setColor(0x00AE86)
  .setTimestamp()
  .setTitle("❗ Uyarı Sistemi ❗")
  .setDescription(message.author.username + " Adlı Yetkili <@" + user.id + "> Adlı Kişiyi `" + reason + "` Sebebinden Dolayı Uyardı!")
  .setFooter(message.author.username + " Adlı Kişi Uyarıyı Verdi")
  return modlog.send(embed);
}
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["uyarı"],
  permLevel: 2
};
exports.help = {
  name: 'uyar',
  description: '',
  usage: 'uyar @kişi [sebep]'
};