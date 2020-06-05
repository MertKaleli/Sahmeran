const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
const db = require('quick.db');
//Data_TR
exports.run = async(client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  let prefix = await require('quick.db').fetch(`prefix_${message.guild.id}`) || ayarlar.prefix
  if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('Bu komutu kullanabilmek için `Yönetici` iznine sahip olmalısın!')
  let panel = await db.fetch(`sunucupanel_${message.guild.id}`)
  
  let rekoronline = await db.fetch(`panelrekor_${message.guild.id}`)
  if(args[0] === "sil" || args[0] === "kapat") {
    db.delete(`sunucupanel_${message.guild.id}`)
    db.delete(`panelrekor_${message.guild.id}`)
  try{
    message.guild.channels.cache.find(x =>(x .name).includes("• Sunucu Panel")).delete()
    message.guild.channels.cache.find(x =>(x .name).includes("Toplam Üye •")).delete()
    message.guild.channels.cache.find(x =>(x .name).includes("Aktif Üye •")).delete()
    message.guild.channels.cache.find(x =>(x .name).includes("Botlar •")).delete()
    message.guild.channels.cache.find(x =>(x .name).includes("Rekor Aktiflik •")).delete()
  } catch(e) { }
    message.channel.send(`Ayarlanan sunucu paneli başarıyla devre dışı bırakıldı!`)
   return 
  }

  if(panel) return message.channel.send(`Bu sunucuda panel zaten ayarlanmış! Devredışı bırakmak için;  \`${prefix}sunucupanel sil\``)
  
      message.channel.send(new Discord.MessageEmbed().setColor(Math.floor(Math.random()*16777215)).setTitle('Sunucu Panel').setDescription('Gerekli dosaylar kurulsun mu?.').setFooter('Onaylıyorsan 15 saniye içerisinde "evet" yazmalısın.'))
.then(() => {
message.channel.awaitMessages(response => response.content === 'evet', {
max: 1,
time: 15000,
errors: ['time'],
}) 
.then((collected) => { 
  
  db.set(`sunucupanel_${message.guild.id}`, message.guild.id)

  try{
  let role = message.guild.roles.cache.find(x => x.name , "@everyone");
  message.guild.channels.create(`${client.user.username} • `, 'category', [{id: message.guild.id, deny: ['CONNECT']}]);
        message.guild.channels.create(`Toplam Üye • ${message.guild.members.cache.size}`, 'voice').then(channel => channel.setParent(message.guild.channels.cache.find(channel => channel.name === `${client.user.username} • `))).then(c => {
            c.overwritePermissions([
                {
                    id: role,
                    deny: ["CONNECT"],
                }
                ]);
  })
  
    message.guild.channels.create(`Aktif Üye • ${message.guild.members.cache.filter(off => off.presence.status !== 'offline').size}`, 'voice').then(channel => channel.setParent(message.guild.channels.cache.find(channel => channel.name === `${client.user.username} • `))).then(c => {
      c.overwritePermissions([
    {
        id: role,
        deny: ["CONNECT"],
    }
    ]);
  })
  
    message.guild.channels.create(`Botlar • ${message.guild.members.cache.filter(m => m.user.bot).size}`, 'voice').then(channel => channel.setParent(message.guild.channels.cache.find(channel => channel.name === `${client.user.username} • `))).then(c => {
        c.overwritePermissions([
            {
                    id: role,
                    deny: ["CONNECT"],
            }
        ]);
  })
  
  message.channel.send(`Sunucu panel için gerekli kanallar oluşturulup, ayarlamalar yapıldı!  \`(Oda isimlerini değiştirmeyin, çalışmaz!)\``)
    
}catch(e){
      console.log(e.stack);
    }
  
    });
});

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sp"],
  permLevel: 3
};

exports.help = {
  name: 'sunucupanel',
  description: 'Sunucu istatistiklerini gösteren panel kurar ve günceller.',
  usage: 'sunucupanel',
  kategori: 'yetkili'
};