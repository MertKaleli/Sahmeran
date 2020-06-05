const Discord = require('discord.js');
exports.run = function(client, message, args) {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")



  if (!message.guild) {
  const ozelmesajuyari = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setTimestamp()
  .setAuthor(message.author.username, message.author.avatarURL)
  .addField(':warning: Uyarı :warning:', '`temizle` adlı komutu özel mesajlarda kullanamazsın.')
  return message.author.send(ozelmesajuyari); }
  if (!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) {
	const botunmesajyonet = new Discord.MessageEmbed()
    .setColor(0xD97634)
    .setTimestamp()
    .setAuthor(message.author.username, message.author.avatarURL)
    .addField(':warning: Uyarı :warning:', 'Mesajları silebilmem için `Mesajları Yönet` yetkisine sahip olmalıyım.')
    return message.author.send(botunmesajyonet);
  }
  let messagecount = parseInt(args.join(' '));
  if (messagecount > 100) return message.reply('Hata: Max 100 Mesaj Temizleyebilirim.');
  if (!messagecount) return message.reply('Doğru kullanım: !temizle <miktar>');
  message.channel.messages.fetch({
    limit: messagecount
  }).then(messages => message.channel.bulkDelete(messages));
    const sohbetsilindi = new Discord.MessageEmbed()
    .setColor(Math.floor(Math.random()*16777215))
    .setTimestamp()
    .setFooter("Bu Mesaj 10 Saniye Sonra Kendini Yokedecektir.")
    .setDescription(message.author.username + " Tarafından " + messagecount + " Mesaj Silindi" )
    message.channel.send(sohbetsilindi).then(r => r.delete({ timeout: 10000 }));
    console.log("Sohbet " + message.author.username + " tarafından silindi!");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'temizle',
  description: 'Belirlenen miktar mesajı siler.',
  usage: 'temizle <temizlenecek mesaj sayısı>'
};
