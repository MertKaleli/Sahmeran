const Discord = require('discord.js');
const db = require("quick.db");
const talkedRecently = new Set();

exports.run = (client, message, member) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  message.delete()

  const embed2 = new Discord.MessageEmbed()
  .setColor(0xf20000)
  .setTitle('Hatalı Kullanım')
  .setDescription(`🧾 **Bu Komutu Sadece Kayıt Kanalında Kullanabilirsiniz.**`)
  .setFooter("Mesaj 3 Saniye İçerisinde Yokolacaktır.")

  let kayıtId = db.fetch(`kayitkanali_${message.guild.id}`);
  channel = message.guild.channels.cache.get(kayıtId)
  if(message.channel  !== channel){
    message.channel.send(embed2).then(msg => {
      msg.delete({ timeout: 3000 })
    })
  }else{

    const embed = new Discord.MessageEmbed()
    .setColor(0x00baf2)
    .setTitle('Kayıt Durumu')
    .addField("NOT", "Discord Gizlilik Ayarlarından Sunucu Üyelerinden Direk Gelen Mesajlara İzin Verin Aksi Takdirde Bot Mesaj Gönderemez!")
    .setDescription(`🧾 **Kayıt işleminiz başarıyla başladı lütfen yetkili yazdığında kayıt odalarına geçin.**`)
      channel.send(embed)
      }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'kayıt',
  description: 'kayıt olmanızı sağlar',
  usage: 'kayıt'
};