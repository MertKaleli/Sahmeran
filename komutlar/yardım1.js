const Discord = require('discord.js');

exports.run = (client, message, member) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    const embed21 = new Discord.MessageEmbed()
    .setColor(Math.floor(Math.random()*16777215))
    .setTitle('🧾 Yetkili Komutları 🧾')
    .addField("🧾 Kayıt Komut Bilgileri 🧾", "» erkek @kişi [İsim] [Yaş]  | .erkek @mert Mert 20 Şeklinde Kullanmanız Gereklidir.\n» kadın @kişi [İsim] [Yaş]  |  .kadın @arzu Arzu 21 Şeklinde Kullanmanız Gerekir.\n\nBu Komutları Sadece 𓇼 📝• Register Commands Rolüne Sahip Olanlar Kullanabilir! ")
    .addField("🧾 Diğer Komutlar 🧾", "»ban @kişi [Sebep] | .ban @mert Deneme Şeklinde Kullanmanız Gereklidir.\n»kick @kişi [Sebep] .kick @mert Deneme Şeklinde Kullanmanız Gereklidir.\n\n Ban Komutunu Sadece Ban Hammer | 𓇼 Rolü Kullanabilir Fakat Kick Komutu Ban Hammer | 𓇼 Ve Kick Hammer | 𓇼 Rolleri Kullanabilir.")
    .addField("🧾 Süre Sistemi 🧾", "m: Dakika, h: Saat, d: Gün")
    .setTimestamp()
    message.channel.send(embed21)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'yy',
  description: 'Yetkili Yardım',
  usage: 'yy'
};