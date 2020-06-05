const Discord = require('discord.js')
const ms = require('ms')

exports.run = async (cleint, message, bot, args) => {

    if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    var currentTime = new Date()
    hours = currentTime.getHours() 
    minutes = currentTime.getMinutes()

    let üyekontrol = db.fetch(`sunucuid_${message.guild.id}`)

    let uyeler = message.guild.memberCount;

    let deneslan1 = client.emojis.cache.find(emoji => emoji.name === "crystal_buton2") 


    const gonderbakem = new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random()*16777215))
        .setDescription(`${deneslan1} ${üyekontrol.name} ${deneslan1}\n\n${deneslan1} Sunucuda Toplam **${uyeler}** Kişi Bulunmaktadır ${deneslan1} `)
        .setFooter(`Bilgilendirme  • bügün saat ${hours}:${minutes} | Komut ${message.author.name} Tarafından Kullanıldı.`)
    message.channel.send(gonderbakem)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
}
exports.help = {
    name: "toplamüye"
}