const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const ms = require('ms');

var prefix = ayarlar.prefix

exports.run = (client, msg, args) => {


  if(msg.author.bot) return;
  if(msg.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  if (!msg.guild) {
  const ozelmesajuyari = new Discord.MessageEmbed()
  .setColor(0xFF0000)
  .setTimestamp()
  .setAuthor(msg.author.username, msg.author.avatarURL)
  .addField(':warning: Uyarı :warning:', '`kilit` adlı komutu özel mesajlarda kullanamazsın.')
  return msg.author.send(ozelmesajuyari); }
  if (!client.lockit) client.lockit = [];
  let time = args.join(' ');
  let validUnlocks = ['kaldır'];
  if (!time) return msg.reply('Doğru kullanım: ' + prefix + 'kilit <süre: 2 min>');

  if (validUnlocks.includes(time)) {
    msg.channel.overwritePermissions([
      {
        id: msg.guild.id,
        allow: ["SEND_MESSAGES"],
      }
    ]).then(() => {
      msg.channel.send('Sohbet Kilidi Kaldırıldı ! @everyone');
      clearTimeout(client.lockit[msg.channel.id]);
      delete client.lockit[msg.channel.id];
    })
  } else {
    msg.channel.overwritePermissions([
      {
        id: msg.guild.id,
        deny: ["SEND_MESSAGES"],
      }
    ]).then(() => {
      const embed2 = new Discord.MessageEmbed()
          .setColor(Math.floor(Math.random()*1677721))
          .setFooter("Sohbet Tekrar Açıldığında @everyone Mesajı Gönderilecektir.")
          .setDescription("Sohbet " + msg.author.username + " Tarafından Kilitlendi ve Bir Süre Kilitli Kalacağı Bildirildi.")
          .addField("Süre", `${ms(ms(time), { long:true })}`)
          .setTimestamp();
      msg.channel.send(embed2).then(() => {

        client.lockit[msg.channel.id] = setTimeout(() => {
          msg.channel.overwritePermissions([
            {
              id: msg.guild.id,
              allow: ["SEND_MESSAGES"],
            }
          ]).then(msg.channel.send('Sohbet Kilidi Kaldırıldı ! @everyone'))
          delete client.lockit[msg.channel.id];
        }, ms(time));

      })
    });
  }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ld'],
  permLevel: 2
};

exports.help = {
  name: 'kilit',
  description: 'Kanalı istediğiniz kadar süreyle kitler.',
  usage: 'kilit <süre>'
};
