const Discord = require('discord.js');
const db = require('quick.db')

exports.run = (client, message, args) => {


    if(message.author.bot) return;
    if(message.channel.type === "dm") return message.reply("Bu Komutları Burada Kullanman Yasak!")


    let Aktif = db.fetch(`yka_${message.guild.id}`)

    if(!Aktif) return message.reply("Yetkilı Alımları Şuanlık Kapalı!")

    let KanalKontrol = db.fetch(`yk_${message.guild.id}`)
    if(!KanalKontrol) return message.reply('Yetkili Alımları İçin Belirlenen Bir Kanal Bulunamadı!') 

    let ykkgonders = message.guild.channels.cache.find(channel => channel.id == KanalKontrol)

    if(message.channel  !== ykkgonders){
        const embed2 = new Discord.MessageEmbed()
        .setColor(0xf20000)
        .setTitle('Hatalı Kullanım')
        .setDescription(`🧾 **Bu Komutu Sadece Belirtilen Yetkili Alımı Kanalında Kullanabilirsiniz.**`)
        .setFooter("Komutları Belirlenen Kanallarda Kullanmaya Özen Gösteriniz!")
            message.author.send(embed2)
    }else{

    if(Aktif == "aktif") {

    let ykkgonder = message.guild.channels.cache.find(channel => channel.id == KanalKontrol)

  let reason = args.slice(0).join(' ');
  if (!reason) return message.reply('Başvuru Örneğini Kontrol Edip, Tekrar Deneyiniz!');
  const embed = new Discord.MessageEmbed()
    .setTitle("📝 Yetkili Alımı Sistemi 📝")
    .setColor(0xD97634)
    .setDescription(`Durum: **Bekleniyor**\nGönderen:  <@${message.author.id}>`)
    .addField('Hakkınızda Bilmemiz Gerekenler', reason)
    .setTimestamp()
    return ykkgonder.send(embed);
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
  name: 'başvuru',
  description: '',
  usage: 'başvuru [Gerekli Şartları Yazınız]'
};