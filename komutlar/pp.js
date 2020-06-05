const Discord = require('discord.js');

exports.run = (client, message, args) => {

    if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


    let kisi = message.mentions.users.first() || message.author

    const avatar = new Discord.MessageEmbed()
    .setColor(Math.floor(Math.random()*16777215))
    .setAuthor(kisi.username + "Adlı Kişinin Profil Fotoğrafı" )
    .setImage(kisi.displayAvatarURL())
    .setFooter("Komut " + message.author.username + " | Tarafından Kullanıldı")
    message.channel.send(avatar)
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["pp"],
	permLevel: 0
}

exports.help = {
	name: 'pp',
	description: 'Etiketlediğiniz kullanıcının avatarını veya Etiket Atmadan Kullanırsanız Kendi Avatarınızı gösterir.',
	usage: 'pp'
}