const db = require("quick.db"); 
const Discord = require("discord.js"); 
const ayarlar = require("../ayarlar.json"); 
exports.run = async (client, message, args) => { 
    if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    if (!args[0]) { 
        const embed = new Discord.MessageEmbed()
        .setColor("GOLD") 
        .setTitle("Kanal Koruma Sistemi") 
        .setDescription( "Hatalı kullanım! örnek: !kk aç && kapat" ); 
        message.channel.send(embed); return; } 
        if (args[0] == "aç") {  
                db.set(`kanalkoru_${message.guild.id}`, "aktif")
                const embed2 = new Discord.MessageEmbed()
                .setColor("BLACK") 
                .setTitle("Kanal Koruma Sistemi") 
                .setDescription("Kanal Koruma Sistemi Aktif Hale Getirildi!")
                .setFooter("Bu Mesaj 15 Saniye İçinde Silinecektir")
                message.channel.send(embed2).then(msg => {
                    msg.delete({ timeout: 15000 })
                  })
        }else if (args[0] == "kapat") { 
            db.delete(`kanalkoru_${message.guild.id}`);
            const embed3 = new Discord.MessageEmbed()
                .setColor("BLACK") 
                .setTitle("Kanal Koruma Sistemi") 
                .setDescription("Kanal Koruma Sistemi Devredışı Bırakıldı!")
                .setFooter("Bu Mesaj 15 Saniye İçinde Silinecektir")
                message.channel.send(embed3).then(msg => {
                    msg.delete({ timeout: 15000 })
                  })
}
}
        exports.conf = { 
            enabled: true, 
            guildOnly: true, 
            aliases: ["kk"], 
            permLevel: 3
        }; exports.help = { 
            name: "kanalkoruma", 
            description: "kanalın korumasını açar", 
            usage: "kanalkoruma" 
        };