const Discord = require('discord.js');
const db = require('quick.db');
exports.run = (client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  let hatas = new Discord.MessageEmbed()
  .setTitle('Uyarı Sistemi')
  .setDescription("<@" + message.author.id + "> Bu Komutu Burada Kullanamazsın!")
  .setColor(Math.floor(Math.random()*16777215))


  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.reply(hatas);

  let user = message.mentions.users.first() 
  let sebep = args.slice(1).join(' ');
  if(!sebep) return message.reply("Bir Sebep Belirtmen Gerekiyor")


  let denkanal = db.fetch(`kanalslar_${message.guild.id}`)
  let dene1 = db.fetch(`kanalslars_${message.guild.id}`)

  let rooms = message.guild.channels.cache.find(x => x.id  === denkanal);
 
    let hata3 = new Discord.MessageEmbed()
    .setTitle('Bilgi Sistemi')
    .setDescription('📋 ' + message.member.user.username + '** .ban <kullanıcıetiketi> [Sebep]** Şeklinde Yazmanız Gerekmektedir!')
    .setColor(Math.floor(Math.random()*16777215))


    let hata4 = new Discord.MessageEmbed()
    .setTitle('Bilgi Sistemi')
    .setDescription("**" + message.member.user.username + '**, Yetkilileri Yasaklayamazsın!')
    .setColor(Math.floor(Math.random()*16777215))
    .setFooter('Bunu Biliyor Olmalıydın!')

    let hata2 = new Discord.MessageEmbed()
    .setTitle('Bilgi Sistemi')
    .setDescription("**" + message.member.user.username + '** Herhangi Bir Kullanıcıyı Yasaklamak İstiyorsan **Ban Hammer | 𓇼** Rolüne Sahip Olmalısın!')
    .setColor(Math.floor(Math.random()*16777215))

    let banrol = message.guild.roles.cache.find(x=> x.name === "Ban Hammer | 𓇼");
    if(!banrol) return message.reply("`Ban Hammer | 𓇼` Rolü Bulunamadı Bu Rolü Oluşturman gerekiyor!")

    if (!message.member.roles.cache.find(x => x.name === "Ban Hammer | 𓇼")) return message.channel.send(hata2);
    if (message.mentions.users.size < 1) return message.channel.send(hata3)    
    if (message.guild.member(user).hasPermission("ADMINISTRATOR")) return message.channel.send(hata4)    


    let bans = new Discord.MessageEmbed()
    .setTitle('Uzaklaştırma Sistemi')
    .setDescription('**<@' + user + '>**,** ' + message.member.user.username + '** Tarafından ' + sebep +' Sebebiyle Sunucudan Yasakladı!')
    .setColor(Math.floor(Math.random()*16777215))
     message.channel.send(bans).then(msg => {
      msg.delete({ timeout: 3000 })
    })
     message.guild.members.ban(user, 2);

     if(dene1 == "aktif") {

      let banss = new Discord.MessageEmbed()
      .setTitle('Uzaklaştırma Sistemi')
      .setDescription('**<@' + user + '>**,** ' + message.member.user.username + '** Tarafından ' + sebep +' Sebebiyle Sunucudan Yasakladı!')
      .setColor(Math.floor(Math.random()*16777215))
      rooms.send(banss)

    }



};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ban',
  description: 'ban atmak',
  usage: 'ban'
};