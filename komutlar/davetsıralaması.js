const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    let invites = await message.guild.fetchInvites().catch(error => {
        return message.channel.send('Davetleri göremiyorum yeterli iznim yok');
    });

    invites = invites.array();

    let possibleinvites = [];
    invites.forEach(function(invites) {
        possibleinvites.push(`${invites.inviter.username} ||  ${invites.uses}`)
    })

    const embed = new Discord.MessageEmbed()
        .setTitle(`**DAVET SIRALAMASİ**`)
        .addField('Davet', `\`\`\`${possibleinvites.join('\n')}\`\`\``)
        .setTimestamp();
    message.channel.send(embed);
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0,

};

exports.help = {
  name: 'ds',
  description: 'Sunucunuza en çok kullanıcı getirenleri sıralar.',
  usage: 'ds',
 
};