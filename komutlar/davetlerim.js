const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json")

exports.run = async (client, message, args) => {

    let deneslan20 = client.emojis.cache.find(emoji => emoji.name === "siyahonay")

   message.guild.fetchInvites().then(invs => {
      let user = message.mentions.users.first() || message.author
      let personalInvites = invs.filter(i => i.inviter.id === user.id);
      let davetsayi = personalInvites.reduce((p, v) => v.uses + p, 0);

      const embed = new Discord.MessageEmbed()
      .setAuthor("Davet Bilgilerin", user.displayAvatarURL())
      .setColor(Math.floor(Math.random()*16777215))
      .setDescription(`${deneslan20} Şuana Kadar ${davetsayi} Kişiyi Davet Etmişssin ${deneslan20}`)


return message.channel.send(embed);
   })
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["davetsayım"],
  permLevel: 0
};

exports.help = {
  name: 'davetlerim',
  description: 'Davetinizle gelen kişi sayısını gösterir',
  usage: 'davetlerim'
};