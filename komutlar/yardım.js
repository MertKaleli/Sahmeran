const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json')

var s = ayarlar.prefix

exports.run = (client, message, member) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz");

    const embed = new Discord.MessageEmbed()
    .setColor(Math.floor(Math.random()*16777215))
    .setTitle('» Bot Hakkında Bilgi')
    .setFooter("🧾 NOT: Kanal Etiketleri Kullanmayınız. Sadece Kanalların İsmini Yazınız Örnek: .kayıtayarla sohbet")
    .addField("» kayıtayarla [kanalismi]", ""+s+"kayıtayarla sohbet Şeklinde Yazarsanız Kayıt Kanalı Ayarlanır.")
    .addField("» kayıt","" +s+"kayıt Yazarak Kayıt Olmayı Bekleyin. Sadece Kayıt Kanalında Kullanılabilir.")
    .addField("» önerikanal [kanalismi]","" +s+"önerikanal sohbet Şeklinde Yazarsanız Öneri Kanalı Ayarlanır.")
    .addField("» öneri [kanalismi]","" +s+"öneri Yazarak Öneri Gönderebilirsiniz. Sadece Öneri Kanalında Kullanılabilir.")
    .addField("» randomşifre","" +s+"randomşifre Komutunu Kullanarak Özelden Rastgele Şifre Alabilirsiniz.")
    .addField("» temizle [miktar]","" +s+"temizle 100 Şeklinde Kanaldan 100 Mesaj Silersiniz Max 100 Mesaj Sınırı Vardır.")
    .addField("» yaz [mesaj]","" +s+"yaz deneme Şeklinde Yazarak Bota Mesaj Yazdırırsınız. Sadece Yönetici Yetkisi Olanlar!")
    .addField("» kilit [Dakika]","" +s+"kilit 1m Şeklinde Yazarak 1 Dakika Boyunca Sohbeti Kitleyebilirsiniz")
    .addField("» oylamakanal [kanalismi]","" +s+"oylamakanal oylama Şeklinde Yazarak Oylama Kanalını Ayarlarsınız.")
    .addField("» oylama [OylamaKonusu]", ""+s+"oylama deneme Şeklinde Yazarak Oylama Yapabilirsiniz. Sadece Oylama Kanalı!")
    .addField("» çayiç","" +s+ "çayiç Komutu İle Çay İçebilirsiniz.")
    .addField("» otorolaç [roladı]", ""+s+"otorolaç üye Şeklinde Yazarak Oto-rol Aktif Edebilirsiniz.")
    .addField("» otorolkapat", ""+s+"otorolkapat Şeklinde Yazarak Oto-rol Sistemini Devredışı Bırakabilirsiniz.")
    .addField("» çekiliş [Dakika] [ÇekilişKonusu]", ""+s+"çekiliş 1m Deneme Şeklinde Yazarak Çekiliş Oluşturabilirsiniz.")
    .addField("» antiraid [Dakika]", "Anti-Raid Sistemini Kullanmak İstediğiniz Kanala " +s+"antiraid 1m Yazarsanız Sunucuya Yeni Giren Kişiler 1 Dakika Boyunca O Kanala Mesaj Atamazlar.")
    .addField("» antiraid kapat", ""+s+"antiraid kapat Komutunu Aktifleştirdiğiniz Kanala Yazarsanız Anti-Raid Sistemini Kapatmış Olursunuz.")
    .addField("» İnvite Engelleme", "Botta Otomatik Olarak Çalışmaktadır. Yönetici rolüne Sahip Olanlar Sadece Discord İnvite Linki Paylaşabilirler.")
    .addField("» destekrol [rolismi]", ""+s+"destekrol support Şeklinde Yazarak Destek Rolünü Seçmiş Olursunuz")
    .addField("» destek [Konu]","" +s+"destek Deneme Şeklinde Yazarak Destek Talebinde Bulunursunuz.")
    .addField("» kapat", "Belirtilen Destek Rolü Sadece Bu Komutu Kullanabilir. Kullanmak İçin Açılmış Olan Destek Talebi Kanalına " +s+"kapat Yazarak Destek Talebini Silebilirsiniz.")
    .addField("» Süre Sistemi", "m: Dakika, h: Saat, d: Gün")
    .setTimestamp()
    message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["y"],
  permLevel: 0
};

exports.help = {
  name: 'yardım',
  description: 'Bot Hakkında Bilgi',
  usage: 'yardım'
};