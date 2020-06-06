const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix

exports.run = (client, message, member) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    const embed21 = new Discord.MessageEmbed()
    .setColor(Math.floor(Math.random()*16777215))
    .setTitle('🧾 Yetkili Komutları 🧾')
    .setDescription(`
    • ${prefix}rk aç & kapat ::Rol Korumasını Açar Veya Kapatır
    • ${prefix}bk aç & kapat :: Bot Koruma Sistemini Açar Veya Kapatır
    • ${prefix}rt :: Kişilerin durumunda Reklam Varsa Gösterir
    • ${prefix}temizle [Miktar] :: Sohbeti Temizler
    • ${prefix}ban @kişi Sebep :: Belirtilen Kişiyi Sunucuda Yasaklar
    • ${prefix}unban id Sebep :: Belirtilen İD ile Kişinin Yasağını Kaldırır
    • ${prefix}uyar @kişi Sebep :: Belirtilen Kişiye Uyarı Verir
    • ${prefix}yaz [Mesaj] :: Bota Yazı Yazdırırsınız
    • ${prefix}yedek al :: Sunucunun Yedeğini Alırsınız
    • ${prefix}yedek bilgi id :: Belirtilen ID'deki Yedeğin Bilgilerini Gösterir
    • ${prefix}yedek sil id :: Belirtilen ID'deki Yedeği Siler
    • ${prefix}ddk aç & kapat :: DDOS Korumasını Açar Veya Kapatır
    • ${prefix}msm aç & kapat :: Silinen Mesajları Log Kanalına Gönderir
    • ${prefix}is aç & kapat :: İnvite Sistemini Açar Veya Kapatır
    • ${prefix}iskanal #kanal :: Belirtilen Kanala Mesajlarını Gönderir
    • ${prefix}modlog [Kanalİsmi] :: Belirtilen Kanalı Modlog Kanalı Olarak Ayarlar
    • ${prefix}modlogkapat :: Modlog Kanalını Siler
    • ${prefix}otorolaç [Rolİsmi] :: Belirtilen Rolü Sunucuya Girene Otomatik Olarak Verir
    • ${prefix}destekrol [Rolİsmi] :: Belirtilen Rolü Destek Rolü Olarak Ayarlar
    • ${prefix}destekrolsil :: Destek Rolünü Temizler
    • ${prefix}ru aç & kapat :: Herhangi Bir Kişiye Rol Eklemeyi Engeller
    • ${prefix}hg [Kanalİsmi] :: Belirtilen Kanalı Hoşgeldin Kanalı Olarak Ayarlar
    • ${prefix}gs :: Güvenlik Sistemini Açar veya Kapatır
    • ${prefix}kayıtayarla [Kanalİsmi] :: Belirtilen Kanalı Kayıt Kanalı Olarak Ayarlar
    • ${prefix}önerikanal [Kanalİsmi] :: Belirtilen Kanalı Öneri Kanalı Olarak Ayarlar
    • ${prefix}önerikanalsil :: Öneri Kanalını Siler
    • ${prefix}sunucuid [id] :: Sunucuyu Veritabanına Kayıt Eder
    • ${prefix}oylamakanal [Kanalİsmi] :: Belirtilen Kanalı Oylama Kanalı Olarak Ayarlar
    • ${prefix}yk [Kanalİsmi] :: Belirtilen Kanalı Yetkili Başvuru Kanalı Olarak Ayarlar
    • ${prefix}rols @rol :: Belirtilen Rolü Şüpheli Hesap Olarak Ayarlar
    `)
    .setTimestamp()
    message.channel.send(embed21)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'yy',
  description: 'Yetkili Yardım',
  usage: 'yy'
};