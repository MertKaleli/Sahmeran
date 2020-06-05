const Discord = require("discord.js");
const ms = require("ms");
const ayarlar = require("../ayarlar.json");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  let hatas = new Discord.MessageEmbed()
  .setTitle('Uyarı Sistemi')
  .setDescription("<@" + message.author.id + "> Bu Komutu Burada Kullanamazsın!")
  .setColor(Math.floor(Math.random()*16777215))

  if(message.author.bot) return;
  if(message.channel.type === "dm") return message.reply(hatas);


  let aktifyap = db.fetch(`kanalslars_${message.guild.id}`)
  message.delete()

if(aktifyap == "aktif") {

  let kontrolet = db.fetch(`kanalslar_${message.guild.id}`)

 if (!message.member.roles.cache.find(x => x.name === "Mute Commands | 𓇼")) 
  return message.channel.send('Bu komutu kullanabilmek için: **Mute Commands | 𓇼** adlı role sahip olmalısın.');
  let mutekisi = message.guild.member(
    message.mentions.users.first() || message.guild.members.get(args[0])
  );
  if (!mutekisi) return message.reply(`Bir Kullanıcı etiketleyiniz `);
  let muterol = message.guild.roles.cache.find(x=> x.name === "🔥| Chat Muted");
  if (!muterol) {
    try {
      muterol = message.guild.roles.create({
        data:{
        name: "🔥| Chat Muted",
        color: "#000000",
      },
        permissions: []
      });
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.overwritePermissions([
          {
          id: muterol,
          deny: ["SEND_MESSAGES", "ADD_REACTIONS"]
          }
        ]);
      });
    } catch (e) {
      console.log(e.stack);
    }
  }
  let mutezaman = args[1]
    .replace(`s`, `s`)
    .replace(`m`, `m`)
    .replace(`h`, `h`)
    .replace(`d`, `d`);
  if (!mutezaman) return message.reply(`Zamanı belirtmedin `)
  let guild = message.guild;
  let reason = args.slice(2).join(" ");
  const member = message.guild.member(mutekisi);
if(!reason) reason = "Sebep Belirtilmedi."
  if (member.hasPermission("ADMINISTRATOR"))
    return message.reply("**Yönetici** Yetkisi olan bir kişiyi muteleyemem !!").then(msg => {
      msg.delete(9000), message.delete(9000);
    }); 
  await mutekisi.roles.add(muterol.id);
  let deneslan = client.emojis.cache.find(emoji => emoji.name === "crystal_sari_buton")

  let modlog3 = new Discord.MessageEmbed()
  .setDescription(`${deneslan} C R Y S T A L ${deneslan}\n\n<@${mutekisi.id}> Adlı Kişi Mutelendi \n\nSüre: **${args[1]}**\n\nSebep: ${reason}`)
  .setFooter(`İşlem Başarıyla Gerçekleştirildi`)
    message.channel.send(modlog3)

    let modlog6 = new Discord.MessageEmbed()
    .setAuthor(`𓇼 C R Y S T A L 𓇼`)
    .setDescription(`${message.guild.name} Adlı Sunucuda Susturuldunuz!\nSüre: **${args[1]}**\nSebep: ${reason}`)
    .setFooter(`İşlem Başarıyla Gerçekleştirildi`)

  mutekisi.send(modlog6);
  
  let modlog = new Discord.MessageEmbed()
    .setColor(Math.floor(Math.random()*16777215))
    .setDescription(`${deneslan} C R Y S T A L ${deneslan}\n\n<@${mutekisi.id}> Adlı Kişi Mutelendi\n Muteleyen Yetkili: **${message.author.username}#${message.author.discriminator}** \n Sebep: **${reason}** \n Süre: **${args[1]}**`)
    message.guild.channels.cache.get(kontrolet).send(modlog);
  setTimeout(function() {
    mutekisi.roles.remove(muterol.id);
    let modlog62 = new Discord.MessageEmbed()
    .setAuthor(`𓇼 C R Y S T A L 𓇼`)
    .setDescription(`${message.guild.name} Adlı Sunucudaki Susturunuz Kaldırıldı!`)
    .setFooter(`İşlem Başarıyla Tamamlandı`)
    mutekisi.send(modlog62);
    let modlog = new Discord.MessageEmbed()
      .setColor(Math.floor(Math.random()*16777215))
      .setDescription(`<@${mutekisi.id}> adlı Kullanıcının "Mute" süresi doldu ${deneslan}`)
      message.guild.channels.cache.get(kontrolet).send(modlog);
  }, ms(mutezaman));

}else{
  message.guild.owner.send("Modlog Kanalı Ayarlanmamış. Lütfen Modlog Kanalını Şu Komutu Kullanarak Ayarlayınız \n!modlog [Kanalismi]")
}
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["mute", "sustur"],
  permLevel: 0
};
exports.help = {
  name: "mute"
};
