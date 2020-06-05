exports.run = function(client, message,args) {

    var roman =["1","2","3","4","5","6"]
    
        let cevap = Math.floor((Math.random() * roman.length));
    
    message.channel.send('Zar Attın Ve İşte Çıkan Sonuç **'+roman[cevap]+'** 🎲')
    };
    
    exports.conf = {
      enabled: true,//True => Komut açık, False => Komut kapalı 
      guildOnly: false, //True => Sadece Servere Özel, False => Heryerde kullanılabilir
      aliases: [],//Komutun farklı kullanımları ÖR: !ping, !p
      permLevel: 0 //kimlerin kullanabileceğini  (bot.js dosyasında perm leveller yazıyor)
    };
    
    exports.help = {
      name: 'zarat',//Komutun adı (Komutu girerken lazım olucak)
      description: '',//Komutun Açıklaması
      usage: '' //komutun kullanım şekli; ÖR: !ban @Kullanıcı
    }