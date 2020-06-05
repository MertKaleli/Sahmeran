const Discord = require('discord.js');
const client = new Discord.Client();

exports.run = async(client, message, args) => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return message.reply("Bu Komut Burada Kullanılamaz!")
  let guild = message.guild
  let reason = args.slice(1).join(' ');
  client.unbanReason = reason;
  client.unbanAuth = message.author;
  let user = args[0];
  let modlog = guild.channels.cache.find(x => x.name === 'admin');
  if (!modlog) return message.reply('mod-log kanalını bulamıyorum.');
  if (reason.length < 1) return message.reply('Ban kaldırma sebebini yazmalısın.');
  if (!user) return message.reply('Banı kaldırılacak kişinin ID numarasını yazmalısın.').catch(console.error);
  message.guild.members.unban(user);
  const embed = new Discord.MessageEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .setTitle('Sistem | Yasak Kaldırıldı!')
    .addFields(
		{ name: 'Kullanıcı', value: `<@${user}>`, inline: true },
		{ name: 'Yetkili', value: `${message.author.username}#${message.author.discriminator}`, inline: true },
		{ name: 'Sebep', value: `${reason}`, inline: true },
    )
  return guild.channels.cache.get(modlog.id).send(embed);
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'unban',
  description: 'İstediğiniz kişinin banını kaldırır.',
  usage: 'unban [kullanıcı] [sebep]'
};