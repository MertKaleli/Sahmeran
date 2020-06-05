const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require("quick.db");

var prefix = ayarlar.prefix;

exports.run = (client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  let destekrolbul = db.fetch(`destek_${message.guild.id}`);
  const embed6 = new Discord.MessageEmbed()
  .setColor(0xf20000)
  .setTitle('Hatalı Kullanım')
  .setDescription(`🧾 **Bu Komutu Sadece Destek Kanallarında Kullanabilirsin.**`)
  .setFooter("Mesaj 3 Saniye İçerisinde Yokolacaktır.")
  
    if (!message.channel.name.startsWith(`yardım-`)) return message.author.send(embed6);
    if(message.member.roles.cache.has(destekrolbul)) {
    message.channel.send(`Destek Kanalını Kapatmak İstediğine Eminmisin? Kapatmak İstiyorsan 'evet' Yazman Yeterli olacaktır`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === 'evet', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Destek Zaman Aşımına Uğradı').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
  }else{
    message.reply("Üzgünüm, Bu Komuta Sadece Destek Ekibi Yetişebilir.")
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 1
};

exports.help = {
  name: 'kapat',
  description: 'Destek Talebinde Bulunarak Sorunlarınızı Çözebilirsiniz',
  usage: 'kapat [sebep]'
};
