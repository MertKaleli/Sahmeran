const Discord = require('discord.js');
const db = require("quick.db");

exports.run = (client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  
  let guild = message.guild
	let mesaj = args.slice(0).join(' ');
	if (!mesaj) return message.reply('Yazmam İçin Birşey Yazmalısın!');
    message.delete();

    const embed2 = new Discord.MessageEmbed()
    .setColor(0xf20000)
    .setTitle('Hatalı Kullanım')
    .setDescription(`🧾 **Bu Komutu Sadece Oylama Kanalında Kullanabilirsiniz.**`)
    .setFooter("Mesaj 3 Saniye İçerisinde Yokolacaktır.")

    let oylaid = db.fetch(`oylamakanal_${message.guild.id}`);
    oylakanal = message.guild.channels.cache.get(oylaid)

    if (message.channel !== oylakanal) {
      message.channel.send(embed2).then(msg => {
        msg.delete({ timeout: 3000 })
      })  
    }else{

      let embed = new Discord.MessageEmbed()
      .setColor("#55FFFF")
      .setTitle('▬▬▬▬▬▬▬▬**«   Oylama Başladı    »**▬▬▬▬▬▬▬▬')
      .setDescription(`*${mesaj}* @everyone`)
      .setTimestamp()
      .setFooter("Oylama Başlatıldı İyi Şanşlar")
      oylakanal.send(embed).then(function (message) {
        message.react("👍")
        message.react("👎")
      });
    
    
    
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'oylama',
  description: 'Oylama Yapar.',
  usage: 'oylama'
};
