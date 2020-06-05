const Discord = require("discord.js");
const bot = new Discord.Client();
const ms = require("ms");

exports.run = (client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


 if (!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send("Anti Raid Komutunu Kullanmak İçin Kanalları Yönet Yetkisine Sahip Olman Gerekli!");
  if (!message.guild.member(client.user).hasPermission('MANAGE_CHANNELS')) return message.reply('Anti Raid Komutunu Kullanmak İçin Kanalları Yönet Yetkisine Sahip Olman Gerekli!')
  if (!client.lockit) client.lockit = [];
  const time = args.join('');
  const validUnlocks = ['kapat', 'stop'];
  if (!time) return message.reply('Kilitlemenin süresini saat, dakika veya saniye olarak ayarlamanız gerekir.');

  if (validUnlocks.includes(time)) {
    message.channel.overwritePermissions([
        {
          id: message.guild.id,
          allow: ["SEND_MESSAGES"],
        },
    ]).then(() => {
      message.channel.send('Kilit Kaldırıldı!');
      clearTimeout(client.lockit[message.channel.id]);
      delete client.lockit[message.channel.id];
    })
  } else {
    message.channel.overwritePermissions([
        {
          id: message.guild.id,
          deny: ["SEND_MESSAGES"],
        },
    ]).then(() => {
      message.channel.send(`Kanal Kilitli: ${ms(ms(time), { long:true })}`).then(() => {

        client.lockit[message.channel.id] = setTimeout(() => {
            message.channel.overwritePermissions([
                {
                  id: message.guild.id,
                  allow: ["SEND_MESSAGES"],
                },
            ]).then(message.channel.send('Kilit Kaldırıldı!'))
          delete client.lockit[message.channel.id];
        }, ms(time));
      })
    });
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
};

exports.help = {
  name: 'antiraid',
  description: 'Sunucuya Raid Atılmasını Engeller',
  usage: 'antiraid'
};