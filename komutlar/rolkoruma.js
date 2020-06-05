const db = require("quick.db"); 
const Discord = require("discord.js"); 
const ayarlar = require("../ayarlar.json"); 
exports.run = async (client, message, args) => { 

    if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    let kontrol = args.slice(0).join(' ');

    if (!kontrol) { 
        const embed5 = new Discord.MessageEmbed()
        .setColor(0xdb710d)
        .setAuthor("Rol Koruma Sistemi")
        .setDescription("Hatalı Kullanım: !rk aç & kapat Şeklinde Kullanabilirsiniz")
        .setTimestamp()
        .setFooter("Sistem | Hatalı Komut Algılandı")
        message.channel.send(embed5); return
    } 
        if (kontrol == "aç") {  
                db.set(`rk_${message.guild.id}`, "aktif")
                const embed2 = new Discord.MessageEmbed()
                .setColor(0xdb710d) 
                .setAuthor("Rol Koruma Sistemi") 
                .setDescription("Rol Koruma Sistemi Aktifleştirildi!")
                .setFooter("Sistem | Rol Koruma Sistemi " + message.author.username + " Tarafından Aktifleştirildi")
                message.channel.send(embed2).then(msg => {
                    msg.delete({ timeout: 15000 })
                  })
        }else if (kontrol == "kapat") { 
            db.delete(`rk_${message.guild.id}`);
            const embed3 = new Discord.MessageEmbed()
            .setColor(0xdb710d) 
            .setAuthor("Rol Koruma Sistemi") 
            .setDescription("Rol Koruma Sistemi Devredışı Bırakıldı!")
            .setFooter("Sistem | Rol Koruma Sistemi " + message.author.username + " Tarafından Devredışı Bırakıldı")
                message.channel.send(embed3).then(msg => {
                    msg.delete({ timeout: 15000 })
                  })
}
}
        exports.conf = { 
            enabled: true, 
            guildOnly: true, 
            aliases: ["rk"], 
            permLevel: 3
        }; exports.help = { 
            name: "rolkoruma", 
            description: "", 
            usage: "rolkoruma" 
        };