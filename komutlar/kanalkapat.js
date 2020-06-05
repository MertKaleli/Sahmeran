const Discord = require("discord.js");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {


  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
   
    let k = db.fetch(`yk_${message.guild.id}`)
    channel = message.guild.channels.cache.get(k)
    let k1 = args.slice(0).join(' ');

    const embed3 = new Discord.MessageEmbed()
    .setColor(0xf20000)
    .setTitle('Hatalı Kullanım')
    .setDescription(`🧾 **Bu Komutu Sadece Yetkili Alımı Kanalında Kullanabilirsiniz.**`)
    .setFooter("Mesaj 3 Saniye İçerisinde Yokolacaktır.")

    if(message.channel  !== channel){
      message.channel.send(embed3).then(msg => {
        msg.delete({ timeout: 3000 })
      })
    }else if(k1 == "aç") { 
        const embed2 = new Discord.MessageEmbed()
        .setColor(0xCF40FA)
        .setAuthor(message.author.username + " Tarafından Gönderildi!")
        .setDescription("Yetkili Alımlarımız Şuanda Kapalıdır. Açıldığı Zaman Buradan Belirtilecektir") 
        .setTimestamp();
        channel.send(embed2);
        
        let role2 = message.guild.roles.cache.find(role => role.name, "@everyone");
        
        channel.overwritePermissions([
          {
            id: message.guild.id,
            deny: ["SEND_MESSAGES"],
          },
          {
            id: role2,
            deny: ["SEND_MESSAGES"],
          }
        ])
      }else if (k1 == "kapat") {

      const embed22 = new Discord.MessageEmbed()
      .setColor(0xCF40FA)
      .setAuthor(message.author.username + " Tarafından Gönderildi!")
      .setDescription("Yetkili Alımları Başlamıştır! @everyone") 
      .setTimestamp();
      channel.send(embed22);
      
      let role21 = message.guild.roles.cache.find(role => role.name, "@everyone");
      
      channel.overwritePermissions([
        {
          id: message.guild.id,
          allow: ["SEND_MESSAGES"],
        },
        {
          id: role21,
          allow: ["SEND_MESSAGES"],
        }
      ])
    }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3,

};

exports.help = {
  name: 'ck',
  description: '',
  usage: 'ck',
 
};