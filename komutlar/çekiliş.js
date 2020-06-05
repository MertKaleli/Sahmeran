const Discord = require('discord.js');
const moment = require('moment');
const ms = require('ms')
exports.run = async (client, message) => {


  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


if(message.author.id == "676916504528158721") {

var time = moment().format('Do MMMM YYYY , hh:mm');
var room;
var title;
var duration;
var currentTime = new Date(),
hours = currentTime.getHours() + 3 ,
minutes = currentTime.getMinutes(),
done = currentTime.getMinutes() + duration,
seconds = currentTime.getSeconds();
if (minutes < 10) {
minutes = "0" + minutes;
}
var suffix = "AM";
if (hours >= 24) {
suffix = "PM";
hours = hours - 24;
}
if (hours == 0) {
hours = 24;
}
var filter = m => m.author.id === message.author.id;
 
  
  
      message.channel.send(`:eight_pointed_black_star:| **Çekilişin yapılacağı kanalın adını yaz**`).then(msg => {
      message.channel.awaitMessages(filter, {
        max: 1,
        time: 20000,
        errors: ['time']
      }).then(collected => {
        let room = message.guild.channels.cache.find(x => x.name  === collected.first().content);
        if(!room) return message.channel.send(':heavy_multiplication_x:| **Böyle bir kanal bulamadım**');
        room = collected.first().content;
        collected.first().delete();
        msg.edit(':eight_pointed_black_star:| **Çekilişin süresini belirle (1s, 1m, 1h, 1d, 1w)**').then(msg => {
          message.channel.awaitMessages(filter, {
            max: 1,
            time: 20000,
            errors: ['time']
          }).then(collected => {
            if(!collected.first().content.match(/[1-60][s,m,h,d,w]/g)) return message.channel.send(':heavy_multiplication_x:| **Böyle bir süre bilmiyorum :(**');
            duration = collected.first().content
            collected.first().delete();
            msg.edit(':eight_pointed_black_star:| **Şimdi de ödülü yaz bakalım**').then(msg => {
              message.channel.awaitMessages(filter, {
                max: 1,
                time: 20000,
                errors: ['time']
              }).then(collected => {
                title = collected.first().content;
                collected.first().delete();
                msg.delete();
                message.delete();
                try {
                  let giveEmbed = new Discord.MessageEmbed()
                  .setColor("#f558c9")
                  .setDescription(`**Ödül: ${title}** \n🎉'a Basarak Katıl \nKalan Süre : ${duration} \n **Başlama Zamanı :** ${hours}:${minutes}:${seconds} ${suffix}`)
                  .setFooter(message.author.username + " Tarafından Çekiliş Başlatıldı", message.author.avatarURL);
                  message.guild.channels.cache.find(x => x.name === room).send(' :heavy_check_mark: **ÇEKİLİŞ BAŞLADI** :heavy_check_mark:' , {embed: giveEmbed}).then(m => {
                     let re = m.react('🎉');
                     setTimeout(() => {
                       let list = m.reactions.cache.get("🎉").users.cache.filter(u => !u.bot).random()
                       let endEmbed = new Discord.MessageEmbed()
                       .setAuthor(message.author.username, message.author.avatarURL)
                       .setTitle(title)
                       .setColor("#f558c9")
                        .setFooter("Çekiliş Sistemi")
                       .addField('🎉Çekiliş Bitti !🎉',`Kazanan : ${list} \nBitiş zamanı :`)
                       .setTimestamp()
                        m.edit('** 🎉 ÇEKİLİŞ BİTTİ 🎉**' , {embed: endEmbed});
                       
                       var embedLel = new Discord.MessageEmbed()
                        .setColor("#f558c9")
                        .setDescription("Ödülünü Moderatörleri Etiketleyerek Alabilirsin!")
                        .setFooter("Çekiliş Sistemi")
                    message.guild.channels.cache.find(x => x.name === room).send(`**Tebrikler ${list}! \`${title}\` kazandın!**` , embedLel)
                }, ms(duration));
            });
                } catch(e) {
                message.channel.send(`:heavy_multiplication_x:| **Maalesef gerekli yetkilerim bulunmamakta**`);
                  console.log(e);
                }
              });
            });
          });
        });
      });
    });
  }else{
    message.reply("Bu Komuta Sadece Özel ID Erişimi Olanlar Erişebilir!")
  } 
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};
exports.help = {
  name: 'çekiliş',
  description: 'Çekiliş mi? Sunucunda güzel şeyler olacak :3',
  usage: 'çekiliş'
};