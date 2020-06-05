const Discord = require('discord.js');
const db = require("quick.db");

exports.run = (client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  var saatsistem = new Date()
  saat = saatsistem .getHours() 
  dakika = saatsistem .getMinutes()

//embeds
  const embed2 = new Discord.MessageEmbed()
  .setColor(0xf20000)
  .setTitle('Hatalı Kullanım')
  .setDescription(`🧾 **Bu Komutu Sadece Öneri Kanalında Kullanabilirsiniz.**`)
  .setFooter("Mesaj 3 Saniye İçerisinde Yokolacaktır.")

  const embed3 = new Discord.MessageEmbed()
  .setColor(0xf20000)
  .setTitle('Bilgi Sistemi')
  .setDescription(`🧾 Sahip, Birisi Öneri Göndermeye Çalıştı Fakat Öneri Kanalı Ayarlanmamış Olduğu İçin Gönderemedi, Öneri Kanalı Ayarlamak İçin: !önerikanal [kanalismi]`)
  .setFooter(`• Bügün Saat ${saat}:${dakika}`)
//embeds

  let guild = message.guild
	let öner = args.slice(0).join(' ');
	if (!öner) return message.reply('Hata: Komutu Yanlış Kullandın. !öneri [önerin]');
    message.delete();

    let önerid = db.fetch(`önerikanal_${message.guild.id}`);
    if(!önerid) {
       message.reply("Sunucuda Öneri Kanalı Ayarlanmamıştı Ve Sunucu Sahibine Bildiriyorum Hemen.");
       message.guild.owner.send(embed3)
       return;
    }
    channel = message.guild.channels.cache.get(önerid)
    if(message.channel  !== channel){
      message.channel.send(embed2).then(msg => {
        msg.delete({ timeout: 3000 })
      })
    }else{
      try{
    let embed = new Discord.MessageEmbed()
    .setColor("#55FFFF")
    .setTitle('▬▬▬▬▬▬▬▬**«   Yeni Öneri    »**▬▬▬▬▬▬▬▬')
    .setDescription("**<@" + message.author.id + `>  Bir Öneri Gönderdi** \n Önerisi: ${öner}`)
    .setTimestamp()
    .setFooter('Gönderilen Öneriler 24 Saat İçinde Otomatik Silinecektir.')
    channel.send(embed).then(r => r.delete('86400000'));
    return;
       }catch(e){
        message.channel.send("Sunucuda Böyle Bir Kanal Yok!");
        message.guild.owner.send("Sunucunda Bir Öneri Kanalı Ayarlanmaya Çalışıldı Fakat Böyle Bir Kanal Bulunamadı!")
       }
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'öneri',
  description: '',
  usage: '!öneri [önerin]'
};
