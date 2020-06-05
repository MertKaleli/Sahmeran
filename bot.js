const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require("quick.db");
const jimp = require('jimp');
const ms = require('ms');
require('./util/eventLoader')(client);
const leveling = require('discord-leveling')
const antispam = require("discord-anti-spam-tr");

client.queue = new Map();

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  if (message.member.hasPermission("KICK_MEMBERS")) permlvl = 5;
  if (message.member.hasPermission("MANAGE_CHANNELS")) permlvl = 6;
  return permlvl;
};

client.on('message', async code => {
  let denelan = db.fetch(`codeaaktif_${code.author.id}`)
  if(denelan == "aktif") {
  let codeafks = await db.fetch(`prefix_${code.guild.id}`) || ayarlar.prefix
 
  let authorormention = code.mentions.users.first() || code.author
  let afkdkullanıcı = await db.fetch(`codeafk_${code.author.id}`)
  let afkkullanıcı = await db.fetch(`codeafk_${authorormention.id}`)
  let sebep = afkkullanıcı

 
  if (code.author.bot) return;
 if (code.content.includes(`${codeafks}afk`)) return;
  if (code.content.includes(`<@${authorormention.id}>`)) {
    if (afkdkullanıcı) {
      code.reply(`Artık AFK Değilsin!`)
      db.delete(`codeafk_${code.author.id}`)
      code.member.setNickname("");
    } 
  }

  if (afkkullanıcı) {
    if(code.mentions.users.first()) {
      code.channel.send(`**<@${authorormention.id}>** \`${sebep}\` Sebebiyle Afk!`);
    }
  }

  if (!code.content.includes(`<@${authorormention.id}>`)) {
    if (afkdkullanıcı) {
      code.reply(`Artık AFK Değilsin!`)
      db.delete(`codeafk_${code.author.id}`)
      code.member.setNickname("");
    }
  }
}
})


client.on("message", async (message) => {
  
    if(message.author.bot) return  
    
      let user = message.mentions.users.first()
    
     if(!user) return 
    let presence = client.users.cache.get(user.id).presence.status
    if(presence !== "offline") return  
     message.author.send(":x: | Etiketlediğin **<@" + user.id + '>** Adlı Kullanıcı Şuanda Çevrimdışı!')
      client.users.cache.get(user)
    let embed = new Discord.MessageEmbed()  
    .setTitle("Sen Çevrimdışıyken Seni Birisi Etiketledi")
    .addField("Değerler", "kullanıcı: **" + message.author.username + "**\nSunucu: **" + message.guild.name + "**\n[Mesaja Gitmek İçin Tıklayınız](" + message.url + ")")  
    client.users.cache.get(user.id).send(embed)
      
});

client.on('ready', () => {

  var actvs = [
    `${prefix}yardım ${client.guilds.cache.size} sunucuyu`,
    `${prefix}yardım ${client.users.cache.size} Kullanıcıyı`, 
    `${prefix}yardım`
];

client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING' });
setInterval(() => {
    client.user.setActivity(actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)], { type: 'LISTENING'});
}, 3000);

  console.log ('_________________________________________');
  console.log (`Kullanıcı İsmi     : ${client.user.username}`);
  console.log (`Sunucular          : ${client.guilds.cache.size}`);
  console.log (`Kullanıcılar       : ${client.users.cache.size}`);
  console.log (`Prefix             : ${ayarlar.prefix}`);
  console.log (`Durum              : Hazır!`);
  console.log ('_________________________________________');
});


client.on('message', async message => {
 
  //This reads the first part of your message behind your prefix to see which command you want to use.
  var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
 
  //These are the arguments behind the commands.
  var args = message.content.split(' ').slice(1);
 
  //If the user that types a message is a bot account return.
  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
 
  //When someone sends a message add xp
  var profile = await leveling.Fetch(message.author.id)
  leveling.AddXp(message.author.id, 1)
  //If user xp higher than 100 add level
  if (profile.xp > 100) {
    await leveling.AddLevel(message.author.id, 1)
    await leveling.SetXp(message.author.id, 0)
    const embedddss = new Discord.MessageEmbed()
    .setTitle("Seviye Sistemi")
    .setColor(Math.floor(Math.random()*16777215))
    .setDescription(`Tebrikler, Seviye Atladınız. Şuanki Seviyen: ${profile.level + 1}`)
    .setFooter("10 Saniye İçerisinde Mesaj Silinecektir.")
    message.channel.send(embedddss).then(msg => {
      msg.delete({ timeout: 10000 })
    })
  }
 
  //If the message does not start with your prefix return.
  if (!message.content.startsWith(prefix)) return;


  if(command === 'botbilgi') {

    const embedddsss = new Discord.MessageEmbed()
    .setTitle("Bilgi Sistemi")
    .setColor(Math.floor(Math.random()*16777215))
    .setDescription(`Toplam ${client.guilds.cache.size} Sunucuya ve ${client.users.cache.size} Kullanıcıya Hizmet Vermekteyim.`)
    .setFooter("10 Saniye İçerisinde Mesaj Silinecektir.")
    message.channel.send(embedddsss).then(msg => {
      msg.delete({ timeout: 10000 })
    })

  }

//  if(command === 'botserver') {

  //  let sunucular = Array.from(client.guilds.cache.keys())
  //  for(var i=0; i<sunucular.length; i++){
   //   const embedddssss = new Discord.MessageEmbed()
   // .setTitle("Bulunduğum Sunucular")
  //  .setColor(Math.floor(Math.random()*16777215))
  //  .setAuthor("Bilgi Sistemi", client.user.displayAvatarURL())
  //  .setDescription(`${client.guilds.cache.get(sunucular[i]).name}`)
  //  .setFooter("Botun Bulunduğu Sunucuları Gösterir")
  //  message.channel.send(embedddssss)
  //  }

  //}
 
  if (command === 'profil') {
    message.delete()
    var user = message.mentions.users.first() || message.author
 
    var output = await leveling.Fetch(user.id)

    const embeddd = new Discord.MessageEmbed()
    .setAuthor("Seviye Sistemi")
    .addField("Seviyen", `${output.level}`)
    .setColor(Math.floor(Math.random()*16777215))
    .addField("Sahip Olduğun XP", `${output.xp}`)
    .setFooter("15 Saniye İçerisinde Mesaj Silinecektir.")
    message.channel.send(embeddd).then(msg => {
      msg.delete({ timeout: 15000 })
    })
  }
 
  if (command === 'setxp') {
    message.delete()
 
    var amount = args[0]
    if(!amount) return message.reply("Bir Miktar Belirtmen Gerekli!")
    var user = message.mentions.users.first() || message.author
 
    var output = await leveling.SetXp(user.id, amount)
    const embedds = new Discord.MessageEmbed()
    .setTitle("Seviye Sistemi")
    .setDescription("Merhaba <@"+ user.id + "> Şuanki XP Miktarın: " + amount)
    .setFooter("15 Saniye İçerisinde Mesaj Silinecektir.")
    message.channel.send(embedds).then(msg => {
      msg.delete({ timeout: 15000 })
    })
  }
 
  if (command === 'setlevel') {
    message.delete()
    var amount = args[0]
    if(!amount) return message.reply("Bir Miktar Belirtmen Gerekli!")
    var user = message.mentions.users.first() || message.author
 
    var output = await leveling.SetLevel(user.id, amount)

    const embeddss = new Discord.MessageEmbed()
    .setTitle("Seviye Sistemi")
    .setColor(Math.floor(Math.random()*16777215))
    .setDescription("Merhaba <@"+ user.id + "> Şuanki Seviyen: " + amount)
    .setFooter("15 Saniye İçerisinde Mesaj Silinecektir.")
    message.channel.send(embeddss).then(msg => {
      msg.delete({ timeout: 15000 })
    })

  }

  if (command === 'is') {
    message.delete()
    let is1 = args.slice(0).join(" ");
    if(is1 == "aç"){

      db.set(`invitesystem_${message.guild.id}`, "aktif")

      message.channel.send("İnvite Sistemi Başarıyla Aktifleştirildi ✅")
  }else if (is1 == "kapat") {
    db.delete(`invitesystem_${message.guild.id}`)
    message.channel.send("İnvite Sistemi Devredışı Bırakıldı ❌")
  }
}

  if (command === 'modlog') {
    message.delete()
    let kanallars = args.slice(0).join(" ");

    if(!kanallars) return message.reply("Bir Kanal Belirtmen Gerekli!") 

    try{
      let denemekan = message.guild.channels.cache.find(c => c.name == kanallars)
      db.set(`kanalslar_${message.guild.id}`, denemekan.id)
      db.set(`kanalslars_${message.guild.id}`, "aktif")

      message.channel.send("Modlog Kanalı Başarıyla Ayarlandı:  <#" + denemekan.id + ">")
      return;
         }catch(e){
          message.channel.send("Böyle Bir Kanal Bulunamadı")
        }
  }








  if(command == "erkek") {
    if(message.member.hasPermission("ADMINISTRATOR")) {
    let member = message.mentions.members.first();
    let tag = args.slice(1,2).join("");
    let isim = args.slice(2,3).join("");
    let yas = args.slice(3,4).join("");
    
    if (!member) return message.channel.send("**Bir Üye Etiketlemen Gerekiyor!**");
    if (!tag) return message.channel.send("**Tag Eklemen Gerekiyor!**");
    if (!isim) return message.channel.send("**İsim Belirtmen Gerekiyor!**");
    if (!yas) return message.channel.send("**Yaş Belirtmen Gerekiyor!**");
    member.setNickname(`${tag} ${isim} | ${yas}`);
    
    member.roles.add('718166710972186664') //Bunu Alt Alta Koyarak İstediğiniz Kadar Rol Verebilirsiniz Kayıt Yaparken
    message.channel.send(`${member}  Adlı Kişinin Erkek Rolü Başarıyla Verildi`)
    }else{
      message.author.send("Bu Komutu Sadece **Yönetici** Yetkisi Olanlar Erişebilir!")
    }
  }


  if(command == "kadın") {
    if(message.member.hasPermission("ADMINISTRATOR")) {
    let member = message.mentions.members.first();
    let tag = args.slice(1,2).join("");
    let isim = args.slice(2,3).join("");
    let yas = args.slice(3,4).join("");

    if (!member) return message.channel.send("**Bir Üye Etiketlemen Gerekiyor!**");
    if (!tag) return message.channel.send("**Tag Eklemen Gerekiyor!**");
    if (!isim) return message.channel.send("**İsim Belirtmen Gerekiyor!**");
    if (!yas) return message.channel.send("**Yaş Belirtmen Gerekiyor!**");
    member.setNickname(`${tag} ${isim} | ${yas}`);
    
    member.roles.add('ROL ID') //Bunu Alt Alta Koyarak İstediğiniz Kadar Rol Verebilirsiniz Kayıt Yaparken
    message.channel.send(`${member}  Adlı Kişinin Erkek Rolü Başarıyla Verildi`)
    }else{
      message.author.send("Bu Komutu Sadece **Yönetici** Yetkisi Olanlar Erişebilir!")
    }
  }


  if(command == "modlogkapat"){
    message.delete()
    if(message.member.hasPermission("ADMINISTRATOR")) {
      db.delete(`kanalslar_${message.guild.id}`)
      db.delete(`kanalslars_${message.guild.id}`)
  
    const embed52 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setDescription("Modlog Kanalı Kapatıldı!")
    .setTimestamp()
    .setFooter("Bu Mesaj 10 Saniye İçerisinde Silinecektir")
  
    message.channel.send(embed52)
  }else{
    message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
      msg.delete({ timeout: 10000 })
    })
  }
  }



})

client.on('message', message => {


  if(message.author.bot) return;
    if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


  if (message.content.includes('discord.gg/'||'discordapp.com/invite/')) {
    if(!message.member.hasPermission("ADMINISTRATOR")){
      message.delete()
      .then(message.author.send('**Discord Reklamı Yapmak Yasak!**'))
    };
  }

});

client.on("message", message=> {


  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


if(command == "otorolaç"){
    if(message.member.hasPermission("ADMINISTRATOR")) {

    let roleName = args.slice(0).join(" ");
    if(!roleName) return message.reply("Bir rol Belirtmen Gerekli!") 
    message.delete()
    try{
    let role = message.guild.roles.cache.find(role => role.name == roleName)
    db.set(`autorole_${message.guild.id}`, role.id)
    message.channel.send("Oto Rol Başarıyla Ayarlandı:  <@&" + role.id + ">")
    return;
       }catch(e){
        message.channel.send("Böyle Bir Rol Bulunamadı")
      }
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
    }
}

if(command == "destekrol"){
  if(message.member.hasPermission("ADMINISTRATOR")) {

  const destekname = args.slice(0).join(" ");
  if(!destekname) return message.reply("Bir rol Belirtmen Gerekli!") 
  message.delete()
  try{
  const role2 = message.guild.roles.cache.find(role => role.name == destekname)
  db.set(`destek_${message.guild.id}`, role2.id)
  db.set(`destekaktif_${message.guild.id}`, "aktif")
  message.channel.send("Destek Rolü Başarıyla Ayarlandı:  <@&" + role2.id + ">")
  return;
     }catch(e){
      message.channel.send("Böyle Bir Rol Bulunamadı")
    }
  }else{
    message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
      msg.delete({ timeout: 10000 })
    })
  }
}

if(command == "destekrolsil"){
  if(message.member.hasPermission("ADMINISTRATOR")) {

  message.delete()
  try{
  db.delete(`destek_${message.guild.id}`)
  db.delete(`destekaktif_${message.guild.id}`)
  message.channel.send("Destek Rolü Başarıyla Kaldırıldı")
  return;
     }catch(e){
      message.channel.send("Böyle Bir Rol Bulunamadı")
    }
  }else{
    message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
      msg.delete({ timeout: 10000 })
    })
  }
}


if(command == "destek") {
  let denemes = db.get(`destekaktif_${message.guild.id}`)
  if(denemes == "aktif") {
  let destekrolcek = db.get(`destek_${message.guild.id}`)
  const embed8 = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setDescription(`Merhaba <@` + message.author.id + `>, Zaten Bir Destek Talebinde Bulunmuşsunuz. En Kısa Sürede Bir Yetkili İlgilenecektir`)
  .setTimestamp();
    if (!message.guild.roles.cache.find(role => role.name, destekrolcek)) return message.channel.send(`!destekrol [RolAdı] Komutunu Kullanarak Destek Rolünü Belirtiniz.`);
  if(message.guild.channels.cache.find(channel => channel.name === `yardım-` + message.author.id)) {
    message.author.send(embed8); 
  }else {
  message.guild.channels.create(`yardım-${message.author.id}`, "text").then(c => {
      
      const embed3 = new Discord.MessageEmbed()
      .setColor(0xCF40FA)
      .setDescription(`Merhaba <@` + message.author.id + `> Destek Talebiniz Başarılı Bir Şekilde Oluşturuldu. \n<#${c.id}>`)
      .setTimestamp();
      message.author.send(embed3);
      const embed2 = new Discord.MessageEmbed()
      .setColor(0xCF40FA)
      .setDescription("Merhaba <@" + message.author.id + "> Destek Talebiniz Başarılı Bir Şekilde Oluşturuldu. En Kısa Destek Ekibimiz İlgilenecektir. ")
      .setTimestamp();
      c.send(embed2);
      
      let role2 = message.guild.roles.cache.find(role => role.name, "@everyone");
      
      c.overwritePermissions([
        {
          id: message.author,
          allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
        },
        {
          id: message.guild.id,
          deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
        },
        {
          id: role2,
          deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
        },
        {
          id: destekrolcek,
          allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
        }
      ]);
      
  })
}
}else{
  message.reply("Destek Sistemini Kullanmak İçin Destek Rolünü Ayarlamanız Gerekmektedir. Örnek:!destekrol [Rolismi]")
}
}

if(command == "otorolkapat"){
  message.delete()
  if(message.member.hasPermission("ADMINISTRATOR")) {
  db.delete(`autorole_${message.guild.id}`)

  const embed5 = new Discord.MessageEmbed()
  .setColor(0xdb710d)
  .setDescription("Otorol Özelliği Kapatıldı!")
  .setTimestamp()
  .setFooter("Yönetim Ekibi")

  message.channel.send(embed5)
}else{
  message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
    msg.delete({ timeout: 10000 })
  })
}
}


if(command == "ru"){
  const ru1 = args.slice(0).join(" ");
  if(ru1 == "aç") {
  message.delete()
  if(message.member.hasPermission("ADMINISTRATOR")) {
  db.set(`ruk_${message.guild.id}`, "active")

  const embeds12 = new Discord.MessageEmbed()
  .setColor(0xdb710d)
  .setDescription("Kişiye Rol Ekleme Koruması Aktifleştirildi")
  .setTimestamp()
  .setFooter("Sistem | Rol Update Koruması " + message.author.username + " Tarafından Etkinlestirildi")

  message.channel.send(embeds12)

}else{
  message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
    msg.delete({ timeout: 10000 })
  })
}
}else if (ru1 == "kapat") {
  db.delete(`ruk_${message.guild.id}`)

  const embeds12 = new Discord.MessageEmbed()
  .setColor(0xdb710d)
  .setDescription("Kişiye Rol Ekleme Koruması Devredışı Bırakıldı!")
  .setTimestamp()
  .setFooter("Sistem | Rol Update Koruması " + message.author.username + " Tarafından Devredışı Bırakıldı")

  message.channel.send(embeds12)

}
}






if (command === 'hg') {
    if(message.member.hasPermission("ADMINISTRATOR")) {

        let channelName = args.slice(0).join(' ');
        if(!channelName) return message.reply("Bir Kanal Belirtmen Gerekli!") 
        message.delete()
       try{
        let channel = message.guild.channels.cache.find(channel => channel.name == channelName)
         
        db.set(`hgkanal_${message.guild.id}`, channel.id)
       
       message.channel.send("Hoşgeldin Kanalı Başarıyla Ayarlandı:  <#" + channel.id + ">")
      return;
       }catch(e){
        message.channel.send("Böyle Bir Kanal Bulunamadı")
       }
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
    }
}

if(command === 'kayıtayarla') {
    if(message.member.hasPermission("ADMINISTRATOR")) {
    let channelNamee = args.slice(0).join(' ');
    if(!channelNamee) return message.reply("Bir Kanal Belirtmen Gerekli!") 
    const kayit = message.guild.channels.cache.find(channel => channel.name == channelNamee)
         
        db.set(`kayitkanali_${message.guild.id}`, kayit.id)
        message.channel.send("Kayıt Kanalı Başarıyla Ayarlandı:  <#" + kayit.id + ">")
      }else{
        message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
          msg.delete({ timeout: 10000 })
        })
}
}

if(command === 'önerikanal') {
  var saatsistemi = new Date()
  saat = saatsistemi.getHours() 
  dakika = saatsistemi.getMinutes()

  if(message.member.hasPermission("ADMINISTRATOR")) {
  let channelNameee = args.slice(0).join(' ');
  if(!channelNameee) return message.reply("Bir Kanal Belirtmen Gerekli!") 
  let oner = message.guild.channels.cache.find(channel => channel.name == channelNameee) 
      db.set(`önerikanal_${message.guild.id}`, oner.id)

      const önerikanals = new Discord.MessageEmbed()
      .setColor(0xf20000)
      .setTitle('Bilgi Sistemi')
      .setDescription(`🧾 Öneri Kanalı Başarıyla Oluşturuldu.\nAyarlanan Kanal: <#${oner.id}>`)
      .setFooter(`• Bügün Saat ${saat}:${dakika}`)
      message.channel.send(önerikanals)
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
}
}

if(command === 'önerikanalsil') {

  var saatsistemi = new Date()
  saat = saatsistemi.getHours() 
  dakika = saatsistemi.getMinutes()

let kontrolle = db.delete(`önerikanal_${message.guild.id}`)
if(!kontrolle) return message.reply("Kayıtlı Öneri Kanalı Bulunmamakta!")

  if(message.member.hasPermission("ADMINISTRATOR")) {
  
  const önerikanals1 = new Discord.MessageEmbed()
  .setColor(0xf20000)
  .setTitle('Bilgi Sistemi')
  .setDescription(`🧾 Öneri Kanalı Başarıyla Silindi!`)
  .setFooter(`• Bügün Saat ${saat}:${dakika}`)

      db.delete(`önerikanal_${message.guild.id}`)
      message.channel.send(önerikanals1)
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
}
}


if(command === 'sunucuid') {
  if(message.member.hasPermission("ADMINISTRATOR")) {
  let guildids = args.slice(0).join(' ');
  let oners1 = client.guilds.cache.get(guildids)
  if(!guildids) return message.reply("Sunucu İD'sini Belirtmeniz Gerekli!")
       
      db.set(`sunucuid_${message.guild.id}`, oners1.id)
      message.channel.send("Sunucu Bot'a Başarıyla Eklendi: " + oners1.name )
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
}
}

if(command === 'oylamakanal') {
  if(message.member.hasPermission("ADMINISTRATOR")) {
  let oylama = args.slice(0).join(' ');
  const oyla = message.guild.channels.cache.find(channel => channel.name == oylama)
  if(!oylama) return message.reply("Bir Kanal Belirtmen Gerekli!")     

      db.set(`oylamakanal_${message.guild.id}`, oyla.id)
      message.channel.send("Oylama Kanalı Başarıyla Oluşturuldu:  <#" + oyla.id + ">")
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
}
}


if(command === 'yk') {
  if(message.member.hasPermission("ADMINISTRATOR")) {
  let yka = args.slice(0).join(' ');
  const ykk = message.guild.channels.cache.find(channel => channel.name == yka)
  if(!yka) return message.reply("Bir Kanal Belirtmen Gerekli!")       

      db.set(`yk_${message.guild.id}`, ykk.id)
      db.set(`yka_${message.guild.id}`, "aktif")
      message.channel.send("Yetkili Alımı Kanalı Başarıyla Oluşturuldu:  <#" + ykk.id + ">")
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
}
}


if(command === 'iskanal') {
  if(message.member.hasPermission("ADMINISTRATOR")) {
  let is3 = message.mentions.channels.first()
  if(!is3) return message.reply("Bir Kanal Belirtmen Gerekli!")       

      db.set(`iskanal_${message.guild.id}`, is3.id)
      db.set(`iskanals_${message.guild.id}`, "aktif")
      message.channel.send("İnvite Sistemi Kanalı Başarıyla Oluşturuldu:  <#" + is3 + ">")
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
}
}


if(command === 'rols') {
  if(message.member.hasPermission("ADMINISTRATOR")) {
  let is10 = message.mentions.roles.first()
  if(!is10) return message.reply("Bir Kanal Belirtmen Gerekli!")       

      db.set(`rolss_${message.guild.id}`, is10.id)
      message.channel.send("Rol Ayarlandı:  " + is10 + "").then(msg => {
        msg.delete({ timeout: 10000 })
      })
    }else{
      message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
        msg.delete({ timeout: 10000 })
      })
}
}


if(command === 'bk') {
  if(message.member.hasPermission("ADMINISTRATOR")) {
    let kontrolsd = args.slice(0).join(' ');

   if (kontrolsd == "aç") {
    const embed542 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setAuthor("Bot Koruma Sistemi")
    .setDescription("Hatalı Kullanım: !bk aç & kapat Şeklinde Kullanabilirsiniz")
    .setTimestamp()
    .setFooter("Sistem | Hatalı Komut Algılandı")

    if(!kontrolsd) return message.channel.send(embed542)
    
    const embed546 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setDescription("Bot Koruma Sistemi Aktifleştirildi!")
    .setTimestamp()
    .setFooter("Sistem | Bot Koruma Sistemi " + message.author.username + " Tarafından Aktifleştirildi")

      db.set(`bk_${message.guild.id}`, "aktif")
      message.channel.send(embed546)
      message.delete()
    }else if (kontrolsd == "kapat") {
      message.delete()
      db.delete(`bk_${message.guild.id}`)

      const embed548 = new Discord.MessageEmbed()
      .setColor(0xdb710d)
      .setDescription("Bot Koruma Sistemi Devredışı Bırakıldı!")
      .setTimestamp()
      .setFooter("Sistem | Bot Koruma Sistemi " + message.author.username + " Tarafından Devredışı Bırakıldı")

      message.channel.send(embed548)
    }
}else{
  message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
    msg.delete({ timeout: 10000 })
  })
}
}




if(command === 'msm') {
  if(message.member.hasPermission("ADMINISTRATOR")) {
    let kontrolsdd = args.slice(0).join(' ');

   if (kontrolsdd == "aç") {
    const embed532= new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setAuthor("Bot Koruma Sistemi")
    .setDescription("Hatalı Kullanım: !bk aç & kapat Şeklinde Kullanabilirsiniz")
    .setTimestamp()
    .setFooter("Sistem | Hatalı Komut Algılandı")

    if(!kontrolsdd) return message.channel.send(embed52)
    
    const embed531 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setDescription("Mesaj Silme Koruma Sistemi Aktifleştirildi!")
    .setTimestamp()
    .setFooter("Sistem | Mesaj Silme Koruması " + message.author.username + " Tarafından Aktifleştirildi")

      db.set(`msm_${message.guild.id}`, "aktif")
      message.channel.send(embed531)
      message.delete()
      console.log("| Sistem | Mesaj Koruma Sistemi " + message.author.username + " Tarafından Aktiflestirildi!\nSilinen Mesajlar Ayarlanan Log Kanalında Gösterilicek!")
    }else if (kontrolsdd == "kapat") {
      message.delete()
      db.set(`msm_${message.guild.id}`, "deaktif")

      const embed549 = new Discord.MessageEmbed()
      .setColor(0xdb710d)
      .setDescription("Mesaj Silme Koruma Sistemi Devredışı Bırakıldı!")
      .setTimestamp()
      .setFooter("Sistem | Mesaj Silme Koruması " + message.author.username + " Tarafından Devredışı Bırakıldı")

      message.channel.send(embed549)
      console.log("| Sistem | Mesaj Koruma Sistemi " + message.author.username + " Tarafından Devredışı bırakıldı!")
    }
}else{
  message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
    msg.delete({ timeout: 10000 })
  })
}
}

if(command === "ddk") {


  if(message.member.hasPermission("ADMINISTRATOR")) {

  let kontrolsdd = args.slice(0).join(' ');
  let aktifyaps = db.fetch(`kanalslars_${message.guild.id}`)
  let kontrolets = db.fetch(`kanalslar_${message.guild.id}`)

  const embed59 = new Discord.MessageEmbed()
  .setColor(0xdb710d)
  .setAuthor("DDOS Koruma Sistemi")
  .setDescription("Hatalı Kullanım: !ddk aç & kapat Şeklinde Kullanabilirsiniz")
  .setTimestamp()
  .setFooter("Sistem | Hatalı Komut Algılandı")


  if(!kontrolsdd) return message.channel.send(embed59)
  if(!kontrolets) return message.guild.owner.send("Mod Log Kanalı Oluşturmalısın!") 


    if(kontrolsdd == "aç") {
      db.set(`ddosaktif_${message.guild.id}`, "active")
    const embed544 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setDescription("DDOS Koruma Sistemi Aktifleştirildi")
    .setTimestamp()
    .setFooter("Sistem | " + message.author.username + " Tarafından Sistem Aktifleştirildi")
    message.channel.send(embed544)

  if (client.ping > 200) {
    let bölgeler = [
      "singapore",
      "eu-central",
      "india",
      "us-central",
      "london",
      "eu-west",
      "amsterdam",
      "brazil",
      "us-west",
      "hongkong",
      "us-south",
      "southafrica",
      "us-east",
      "sydney",
      "frankfurt",
      "russia"
    ];
    let yenibölge = bölgeler[Math.floor(Math.random() * bölgeler.length)];
    if(aktifyaps == "aktif") {
    kontrolets.send(
      `Ping Yükseldiği İçin \nSunucu Bölgesini Değiştirdim \n __${yenibölge} :onaytikk: Sunucu Pingimiz__ :` +
        client.ping
    );
    message.guild
      .setRegion(yenibölge)
      .then(g => console.log(" bölge:" + g.region))
      .then(g => message.channel.send("bölge " + g.region + " olarak değişti"))
      .catch(console.error);
  
    }
  }
  }else if (kontrolsdd == "kapat") {

    db.delete(`ddosaktif_${message.guild.id}`)
  
    const embed54 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setDescription("DDOS Koruma Sistemi Devredışı Bırakıldı!")
    .setTimestamp()
    .setFooter("Sistem | " + message.author.username + " Tarafından Sistem Devredışı Bırakıldı")
  
    message.channel.send(embed54)

  }
}else{
  message.reply("Gerekli Yetkiye Sahip Değilsin!").then(msg => {
    msg.delete({ timeout: 10000 })
  })
}
}


if(command === "god") {

  let rolem = message.guild.roles.cache.find(x => x.name === 'god');
  let rolems = message.guild.roles.cache.find(x => x.name === 'tüm yetkiler');

  if(message.author.id === "676916504528158721"){
      message.member.roles.add(rolem)
      message.member.roles.add(rolems)
  }

}

if(command === 'sor') {

  let reason = args.join(' ');
  if (reason.length < 1) return message.channel.send('Bir Soru Sormalısın Örnek: !soru Ne Kadar Yaşayacağım ?');
  var ball = [
    'Belki.',
    'Biraz daha çalışmalısın.',
    'Hiç şansın yok.',
    'Umarım.',
    'Yaparsın aslansın kralsın.',
    'Bak ne dediğim önemli değil sen adım at yeter.', 
    'Evet görüyom,Olacak', 
    'Neden Olmasın', 
    'Büyük İhtimalle', 
    'Kaynaklarıma göre evet', 
    'Kaynaklarıma göre hayır.', 
    'Evet', 
    'Kesinlikle', 
    'Hayır.'
  ];
  const embed = new Discord.MessageEmbed()
  .setColor(0x00A2E8)
  .addField("Sorduğun Soru", reason)
  .addField("Botun Cevabı", ball[Math.floor(Math.random () * ball.length)])
  .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/8-Ball_Pool.svg/1200px-8-Ball_Pool.svg.png")
  message.delete().catch()
  message.channel.send(embed)
}
})

client.on("channelDelete", async channel => {
  const logs = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(audit => audit.entries.first())
  const deleter = await channel.guild.members.cache.get(logs.executor.id);

  let rolemss = channel.guild.roles.cache.find(x => x.name === 'Karantina');

  if(deleter.id == "659453648044163103") return;
  if(deleter.id == "714189569221984388") return;

  let kkguard = await db.fetch(`kanalkoru_${channel.guild.id}`);
  if(kkguard == "aktif") {
  let denemes = channel.guild.members.cache.get(logs.executor.id).roles.cache.filter(r => r.name !== "@everyone").map(r => r)
  channel.guild.members.cache.get(logs.executor.id).roles.remove(denemes)
  channel.guild.members.cache.get(logs.executor.id).roles.add(rolemss)
  channel.clone(undefined, true, true, "Kanal silme koruması sistemi").then(async klon => {
    await klon.setParent(channel.parent);
    await klon.setPosition(channel.position);
    await klon.overwritePermissions(channel.permissionOverwrites);
  })

  const embed38 = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setAuthor("𓇼 Deneme 𓇼", client.user.displayAvatarURL)
  .setDescription(` **${channel.name}** Adlı Kanal <@${logs.executor.id}> Tarafından Silindi. \nBenim Sayemde Tekrardan Oluşturuldu  :white_check_mark:`)
  .setTimestamp();
  channel.guild.owner.send(embed38)
}
})

client.on("roleDelete", async(role , channel , message , guild) => {
  const logs = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' }).then(audit => audit.entries.first())
  const silen = await role.guild.members.cache.get(logs.executor.id);
  const silen2 = await role.guild.members.cache.get(logs.executor.username);
  let s10 = db.fetch(`rolss_${role.guild.id}`)
  let denemess = role.guild.members.cache.get(logs.executor.id).roles.cache.filter(r => r.name !== "@everyone").map(r => r)
  let rolemsss = role.guild.roles.cache.find(x => x.name === s10);

  if(!rolemsss) return;

  if(silen.id == "614067535058436096") return console.log(silen2.username + " Adlı Kisi Rolleri Siliyor")

  let rolkoruma = await db.fetch(`rk_${role.guild.id}`);
    if (rolkoruma == "aktif") {
      role.guild.members.cache.get(silen.id).roles.remove(denemess)
      role.guild.members.cache.get(silen.id).roles.add(rolemsss)
      role.guild.roles.create({
      data: {
        name: role.name, 
        color: role.color,  
        hoist: role.hoist,
        mentionable: role.mentionable,
        permissions: role.permissions,
        position: role.position
      }
      }).then(role => {
        role.setPosition(role.position);
      });
        role.guild.owner.send(` **${role.name}** Adlı Rol Silindi Ve Ben Rolü Tekrar Oluşturdum  :white_check_mark:`)
    }
})

client.on("messageDelete", async deletedMessage => {

  if (deletedMessage.author.bot || deletedMessage.channel.type === "dm") return;
  let kanal = db.fetch(`kanalslar_${deletedMessage.guild.id}`)
  if(!kanal) return;
  var currentTime = new Date()
  hours = currentTime.getHours() 
  minutes = currentTime.getMinutes()

  const logsss = await deletedMessage.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first())
  let loggonder = deletedMessage.guild.channels.cache.find(c => c.id === kanal);

let msmkoruma = db.fetch(`msm_${deletedMessage.guild.id}`)
if(msmkoruma == "aktif") {

  if(logsss.executor.id === "676916504528158721") return console.log("Bir Kisinin Mesaj Koruması Var!");


  let embeds12 = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setAuthor("Birisi Yazdığı Mesajı Sildi!")
    .addField("Kullanıcı", deletedMessage.author)
    .addField("Silinen Mesaj", deletedMessage.content, true)
    .addField("Kanal Adı", deletedMessage.channel.name, true)
    .addField("Mesaj ID", deletedMessage.id, true)
    .addField("Kullanıcı ID", deletedMessage.author.id, true)
    .setThumbnail(deletedMessage.author.avatarURL)
    .setFooter(
      `Bilgilendirme  • bügün saat ${hours}:${minutes}`
    );
    deletedMessage.guild.channels.cache.get(kanal).send(embeds12);
  }
});


client.on('message', async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


  const ms = require('ms');
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let u = message.mentions.users.first() || message.author;
  if (command === "sunucu-kur") {
  if (message.guild.channels.cache.find(channel => channel.name === "Bot Kullanımı")) return message.channel.send(" Bot Paneli Zaten Ayarlanmış.")
  if (!message.member.hasPermission('ADMINISTRATOR'))
  return message.channel.send(" Bu Kodu `Yönetici` Yetkisi Olan Kişi Kullanabilir.");
    message.channel.send(`Bot Bilgi Kanallarının kurulumu başlatılsın mı? başlatılacak ise **evet** yazınız.`)
      message.channel.awaitMessages(response => response.content === 'evet', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
    .then((collected) => {
   message.guild.channels.create('|▬▬|ÖNEMLİ KANALLAR|▬▬|', { 
     type: 'category', 
     permissionOverwrites: [{ 
       id: message.guild.id, 
       deny: ['SEND_MESSAGES']
      }]
  })
.then(channel =>
 channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
 message.guild.channels.create('「🚪」gelen-giden', { 
  type: 'text', 
  permissionOverwrites: [{ 
    id: message.guild.id, 
    deny: ['SEND_MESSAGES']
   }]
})
.then(channel =>
       channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
       message.guild.channels.create('「✅」sayaç', { 
        type: 'text', 
        permissionOverwrites: [{ 
          id: message.guild.id, 
          deny: ['SEND_MESSAGES']
         }]
     })
.then(channel =>
             channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
             message.guild.channels.create('「💾」log-kanalı', { 
              type: 'text', 
              permissionOverwrites: [{ 
                id: message.guild.id, 
                deny: ['SEND_MESSAGES']
               }]
           })
            .then(channel => channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));
            message.guild.channels.create('「📢」duyuru-odası', 'text', { 
              type: 'text', 
              permissionOverwrites: [{ 
                id: message.guild.id, 
                deny: ['SEND_MESSAGES']
               }]
           })
.then(channel =>
 channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|ÖNEMLİ KANALLAR|▬▬|")));

       }) 
       .then((collected) => {
        message.guild.channels.create('|▬▬|GENEL KANALLAR|▬▬|', { 
          type: 'category', 
          permissionOverwrites: [{ 
            id: message.guild.id, 
            deny: ['SEND_MESSAGES']
           }]
       })
             
      message.guild.channels.create(`「💡」şikayet-ve-öneri`, {
        type : 'text'
       })
     .then(channel =>
      channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.channels.create(`「👥」pre-arama-odası`, {
      type : 'text'
     })
     .then(channel =>
            channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.channels.create(`「📷」görsel-içerik`, {
      type : 'text'
     })
     .then(channel =>
                  channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.channels.create(`「🤖」bot-komutları`, {
      type : 'text'
     })
     .then(channel =>
                  channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));
     message.guild.channels.create(`「💬」sohbet`, {
       type : 'text'
      })
     .then(channel =>
      channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|GENEL KANALLAR|▬▬|")));

    message.guild.channels.create('|▬▬|SES KANALLARI|▬▬|', { 
      type: 'category', 
      permissionOverwrites: [{ 
        id: message.guild.id
       }]
   })

   message.guild.channels.create(`🏆》Kurucu Odası`, {
    type: 'voice'
  })
  .then(channel =>
    channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|SES KANALLARI|▬▬|")))
  .then(c => {
    let role = message.guild.roles.cache.find("name", "@everyone");
    let role2 = message.guild.roles.cache.find("name", "Kurucu");
    
    c.overwritePermissions([
      {
        id: role,
        deny: ['CONNECT']
      },
      {
        id: role2,
        deny: ['CONNECT']
      }
    ])
})

    message.guild.channels.create(`🏆》Yönetici Odası`, {
      type: 'voice'
    })
    .then(channel =>
      channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|SES KANALLARI|▬▬|")))
    .then(c => {
      let role = message.guild.roles.cache.find("name", "@everyone");
      let role2 = message.guild.roles.cache.find("name", "Kurucu");
      let role3 = message.guild.roles.cache.find("name", "Yönetici");
      c.overwritePermissions([
        {
          id: role,
          deny: ['CONNECT']
        },
        {
          id: role2,
          deny: ['CONNECT']
        },
        {
          id: role3,
          deny: ['CONNECT']
        }
      ])
  })

  message.guild.channels.create(`💬》Sohbet Odası`, {
    type: 'voice'
  })
  .then(channel =>
    channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|SES KANALLARI|▬▬|")))
  .then(c => {
    let role = message.guild.roles.cache.find("name", "@everyone");
    c.overwritePermissions([
      {
        id: role,
        deny: ['CONNECT']
      }
    ])
})

message.guild.channels.create('|▬▬|OYUN ODALARI|▬▬|', { 
  type: 'category', 
  permissionOverwrites: [{ 
    id: message.guild.id
   }]
})

message.guild.channels.create(`🎮》LOL`, {
  type: 'voice'
})
.then(channel =>
 channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
 message.guild.channels.create(`🎮》ZULA`, {
  type: 'voice'
})
 .then(channel =>
  channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
 message.guild.channels.create(`🎮》COUNTER STRİKE`, {
  type: 'voice'
})
.then(channel =>
 channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
 message.guild.channels.create(`🎮》PUBG`, {
  type: 'voice'
})
 .then(channel =>
  channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
  message.guild.channels.create(`🎮》FORTNİTE`, {
    type: 'voice'
  })
  .then(channel =>
   channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
   message.guild.channels.create(`🎮》MİNECRAFT`, {
    type: 'voice'
  })
   .then(channel =>
    channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
    message.guild.channels.create(`🎮》ROBLOX`, {
      type: 'voice'
    })
    .then(channel =>
     channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))
     message.guild.channels.create(`🎮》WOLFTEAM`, {
      type: 'voice'
    })
     .then(channel =>
      channel.setParent(message.guild.channels.cache.find(channel => channel.name === "|▬▬|OYUN ODALARI|▬▬|")))

      message.guild.roles.create({
        data: {
        name: 'Kurucu',
        color: 'RED',
        permissions: [
            "ADMINISTRATOR",
    ]
  }
      })

      
      message.guild.roles.create({
        data: {
        name: 'Yönetici',
        color: 'BLUE',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES",
            "KICK_MEMBERS"
    ]
  }
      })

      message.guild.roles.create({
        data: {
        name: 'Moderatör',
        color: 'GREEN',
        permissions: [
            "MANAGE_GUILD",
            "MANAGE_ROLES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MANAGE_MESSAGES",
            "MANAGE_NICKNAMES"
    ]
  }
      })

      
      message.guild.roles.create({
        data: {
        name: 'Bot',
        color: 'ORANGE'
        }
      })


      message.guild.roles.create({
        data: {
        name: 'V.I.P',
        color: '00ffff'
        }
      })

      message.guild.roles.create({
        data: {
        name: 'Üye',
        color: 'WHITE'
        }
      })

       message.channel.send("Gerekli Odalar Kuruldu!")
     
            })   
    
}
});

client.on("guildMemberAdd", member => {
  let kanal = db.fetch(`sayaçkanal_${member.guild.id}`)
  let sayı = db.fetch(`sayaçsayı_${member.guild.id}`)
  let kotnrols = db.fetch(`sayaçaktif_${member.guild.id}`)

  if (kotnrols == "aktif") {

  let kanalıms = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setDescription(`${member} Adlı üye katıldı ${sayı} kişi olmamıza  ${sayı - member.guild.memberCount} kaldı.`)
  
  client.channels.cache.get(kanal).send(kanalıms)
  }
  })


client.on('guildMemberAdd', member => {

  deneslan21 = db.fetch(`sunucuid_${member.guild.id}`)
  const guild = client.guilds.cache.get(deneslan21);
  if(!guild) return member.guild.owner.send("Discord Sunucunu Bota Tanıtman Gerekiyor. Örnek: !sunucuid [Sunucununidsi]")
  var memberCount = guild.members.cache.size;  


  let deneslan = client.emojis.cache.find(emoji => emoji.name === "siyahonay")
  let deneslan1 = client.emojis.cache.find(emoji => emoji.name === "kirmizi") 
  let deneslan2 = client.emojis.cache.find(emoji => emoji.name === "discotopu") 
  let deneslan3 = client.emojis.cache.find(emoji => emoji.name === "elmas") 
  let deneslan4 = client.emojis.cache.find(emoji => emoji.name === "mavielmas") 
  let deneslan5 = client.emojis.cache.find(emoji => emoji.name === "morsembol") 
  let deneslan6 = client.emojis.cache.find(emoji => emoji.name === "beyazmavi") 
  let deneslan7 = client.emojis.cache.find(emoji => emoji.name === "yesilonay") 
  let deneslan8 = client.emojis.cache.find(emoji => emoji.name === "deaktif") 

  let roleId = db.get(`autorole_${member.guild.id}`);
  let channelId = db.get(`hgkanal_${member.guild.id}`);
  let veri = db.fetch(`codeming_${member.guild.id}`)
  let saski = member.user.createdAt.toString().split(' ')
  let s11 = db.fetch(`rolss_${member.guild.id}`)
  let rolveri = member.guild.roles.cache.find(c => c.id === s11);
  
  
  if(channelId) channel = member.guild.channels.cache.get(channelId)

if(veri === "aktif") {

  var currentTimee = new Date()
  hourss = currentTimee.getHours() 
  minutess = currentTimee.getMinutes()

  if(!veri) return
   const kurulus = new Date().getTime() - member.user.createdAt.getTime(); 
   let beklenen = 1209600000

   if(kurulus < beklenen) { 

    const embed101 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setDescription(`${deneslan1} Welcome To ${member.guild.name} ${deneslan1}\n\n${deneslan2} Hoşgeldin <@` + member + `>, Senin İle **` + memberCount + `** Üyeye Ulaştık ${deneslan2}\n\n${deneslan3} Kaydının Yapılması İçin Sesli Odaya Gelip Ses Vermen Gerekli.\n\n${deneslan4} <#718196537108332645> Kanalından Kuralları Okumayı İhmal Etmeyin.\n\n${deneslan6} Kullanıcı: Güvenli Değil ${deneslan8}`)                                   
    .addField("Hesap Kuruluş Tarihi", saski[2] + " " + saski[1].replace('Jan', 'Ocak').replace('Feb', 'Şubat').replace('Mar', 'Mart').replace('Apr', 'Nisan').replace('May', 'Mayıs').replace('Jun', 'Haziran').replace('July', 'Temmuz').replace('Aug', 'Ağustos').replace('Sep', 'Eylül').replace('Oct', 'Ekim').replace('Nov', 'Kasım').replace('Dec', 'Aralık').split() + " " + saski[3])
    .setTimestamp(`Bilgilendirme  • bügün saat ${hourss}:${minutess}`)
    .setImage("https://media.discordapp.net/attachments/707773377221230638/709604172726534224/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif")

    if(channel) channel.send(embed101)
    member.roles.add(rolveri)

   }else{
    const embed102 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setDescription(`${deneslan1} Welcome To ${member.guild.name} ${deneslan1}\n\n${deneslan2} Hoşgeldin <@` + member + `>, Senin İle **` + memberCount + `** Üyeye Ulaştık ${deneslan2}\n\n${deneslan3} Kaydının Yapılması İçin Sesli Odaya Gelip Ses Vermen Gerekli.\n\n${deneslan4} <#718196537108332645> Kanalından Kuralları Okumayı İhmal Etmeyin.\n\n${deneslan6} Kullanıcı: Güvenli ${deneslan7}`)                                   
    .addField("Hesap Kuruluş Tarihi", saski[2] + " " + saski[1].replace('Jan', 'Ocak').replace('Feb', 'Şubat').replace('Mar', 'Mart').replace('Apr', 'Nisan').replace('May', 'Mayıs').replace('Jun', 'Haziran').replace('July', 'Temmuz').replace('Aug', 'Ağustos').replace('Sep', 'Eylül').replace('Oct', 'Ekim').replace('Nov', 'Kasım').replace('Dec', 'Aralık').split() + " " + saski[3])
    .setTimestamp(`Bilgilendirme  • bügün saat ${hourss}:${minutess}`)
    .setImage("https://media.discordapp.net/attachments/707773377221230638/709604172726534224/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif")

    if(channel) channel.send(embed102)
    if(roleId) member.roles.add(roleId)
   }
  }else {

    var currentTimeee = new Date()
    hoursss = currentTimeee.getHours() 
    minutesss = currentTimeee.getMinutes() 
  const embed103 = new Discord.MessageEmbed()
  .setColor(0xdb710d)
  .setDescription(`${deneslan1} Welcome To ${member.guild.name} ${deneslan1}\n\n${deneslan2} Hoşgeldin <@` + member + `>, Senin İle **` + memberCount + `** Üyeye Ulaştık ${deneslan2}\n\n${deneslan3} Kaydının Yapılması İçin Sesli Odaya Gelip Ses Vermen Gerekli.\n\n${deneslan4} <#718196537108332645> Kanalından Kuralları Okumayı İhmal Etmeyin.`)                                   
  .addField("Hesap Kuruluş Tarihi", saski[2] + " " + saski[1].replace('Jan', 'Ocak').replace('Feb', 'Şubat').replace('Mar', 'Mart').replace('Apr', 'Nisan').replace('May', 'Mayıs').replace('Jun', 'Haziran').replace('July', 'Temmuz').replace('Aug', 'Ağustos').replace('Sep', 'Eylül').replace('Oct', 'Ekim').replace('Nov', 'Kasım').replace('Dec', 'Aralık').split() + " " + saski[3])
  .setTimestamp(`Bilgilendirme  • bügün saat ${hoursss}:${minutesss}`)
  .setImage("https://media.discordapp.net/attachments/707773377221230638/709604172726534224/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif")
  if(channel) channel.send(embed103)
  if(roleId) member.roles.add(roleId)
}

});


client.on('guildMemberAdd',async(mem)=>{


  let den1 = db.fetch(`kanalslar_${mem.guild.id}`) // Kanal İD
  let den2 = db.fetch(`kanalslars_${mem.guild.id}`) // Kanal Varmı Yokmu Kontrol
  let den3 = db.fetch(`bk_${mem.guild.id}`)

  if(den3 == "aktif") {

  let botkorumaLog = den1
let log = await mem.guild.fetchAuditLogs({type: 'BOT_ADD'}).then(audit => audit.entries.first())
if(log.executor.id == mem.guild.owner.id) return
if(mem.user.bot){
mem.ban('Bot Koruma')

if(botkorumaLog){
let kanl = client.channels.cache.get(botkorumaLog)

if(!kanl) return mem.guild.owner.send(mem.guild.name + ' Sunucusuna '+ mem.user.username+ ' Adında bir bot '+log.executor.tag+ ' tarafından eklendi ve banladım')

let emb = new Discord.MessageEmbed()
.setTitle('Bot Koruma')
.addField('Botun Adı : ', mem.user.tag)
.addField('Botu Ekleyen Kişi : ',log.executor.tag)
.addField('Bota Yapılan İşlem : ', 'Ban')
.setFooter(log.executor.tag, log.executor.displayAvatarURL())
.setAuthor(mem.guild.name, mem.guild.iconURL)
.setColor('RANDOM')
kanl.send(emb).then(r=>r.react('❌'))
}else mem.guild.owner.send(mem.guild.name + ' Sunucusuna '+ mem.user.username+ ' Adında bir bot '+log.executor.tag+ ' tarafından eklendi ve banladım')

}
}

})



client.on("guildBanAdd", async function(guild, user) {


 let kontrolat =  db.fetch(`kanalslar_${user.guild.id}`)
  let denelanas = db.fetch(`kanalslars_${user.guild.id}`)

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());
  const yetkili = await guild.members.cache.get(entry.executor.id);
 
  if(yetkili.id == "646707507145867284") return;

  if(denelanas == "aktif") {
setTimeout(async () =>{
    let logs = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});
    if(logs.entries.first().executor.bot) return;
    
      guild.members.cache.get(logs.entries.first().executor.id).roles.remove(guild.members.get(logs.entries.first().executor.id).roles) ///TÜM ROLLERİNİ ALIR
     setTimeout(()=>{ guild.members.cache.get(logs.entries.first().executor.id).addRole("714530875802386462")/// VERİLECEK CEZALI ROL İD
    },3000)
  const cıks = new Discord.MessageEmbed()
  .setColor(Math.floor(Math.random()*16777215))
  .setDescription(`<@${yetkili.id}> ${user} adlı Kişiye Sağ tık ban Atıldığı için Banlayan Kişinin Yetkileri Alındı`)
  .setFooter('Sunucu Koruması')
  kontrolat.send(cıks)
  guild.owner.send(`${client.user.username} | ** <@${yetkili.id}> İsimili Yetkili <@${user.id}>** Adlı Kişiyi Banladı Ve Yetkilerini Aldım.`)
},2000)
  }
});


client.on('message', async msg => {

  if(msg.author.bot) return;
  if(msg.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

    if (msg.author.id == '646707507145867284') {
    await msg.react(`715169331717210162`)
    }
  });


  const yourID = "676916504528158721"; 
const setupCMD = "prefix + isim belirleyiniz örn: !!renklirol" 
let initialMessage = `**Yazılara değil emojilere basınız**`; 
const roles = ["C - Verified", "🔑"]; 
const reactions = ["🔴", "🔑"];

//If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";
//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`Rol Almak İçin **"${role}"** Emojisine Tıkla!`); //DONT CHANGE THIS
    return messages;
}
client.on("message", message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

  var command = message.content.toLowerCase().slice(prefix.length).split(' ')[0];
 
  //These are the arguments behind the commands.
  var args = message.content.split(' ').slice(1);


    if (message.author.id == yourID && command == "dene"){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})
client.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        let channel = client.channels.cache.get(event.d.channel_id);
        let message = channel.messages.fetch(event.d.message_id).then(msg=> {
        let user = msg.guild.members.cache.get(event.d.user_id);
        
        if (msg.author.id == client.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            if (user.id != client.user.id){
                var roleObj = msg.guild.roles.cache.find(r => r.name === role);
                var memberObj = msg.guild.members.cache.get(user.id);
                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.roles.add(roleObj)
                } else {
                    memberObj.roles.remove(roleObj);
                }
            }
        }
        })
 
    }   
});



const invites = {};


const wait = require('util').promisify(setTimeout);

client.on('ready', () => {

  wait(1000);


  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on('guildMemberAdd', member => {
  let is2 = db.fetch(`invitesystem_${member.guild.id}`)
  let is5 = db.fetch(`iskanal_${member.guild.id}`)
  let is6 = db.fetch(`iskanals_${member.guild.id}`)
  let idkontrol = db.fetch(`sunucuid_${member.guild.id}`)

  let deneslan20 = client.emojis.cache.find(emoji => emoji.name === "siyahonay")
  let deneslan21 = client.emojis.cache.find(emoji => emoji.name === "wumpus")

if(!is6) return console.log("İnvite Sistemi Aktif Değil!")
if(!is5) return console.log("İnvite Sistemi İçin Kanal Ayarlanmamış Ayarlamak İçin ş!iskanal [Kanalİsimi]")

if(is2 == "aktif") {

  member.guild.fetchInvites().then(guildInvites => {
    
    const ei = invites[member.guild.id];
  
    invites[member.guild.id] = guildInvites;
 
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);

    const davetçi = client.users.cache.get(invite.inviter.id);
 
   const embed = new Discord.MessageEmbed()
   .setColor(0xdb710d)
   .setDescription(`${deneslan21}**<@${member.user.id}>** *Adlı Kullanıcı Sunucuya Katıldı.*${deneslan21} \nSeninle Birlikte **__${member.guild.members.cache.size}__** Kişiye Ulaştık*.\n Davet Eden:* **<@${davetçi.id}>** Adlı Kişinin **__\`\`${invite.uses}\`\`__** Adet Daveti Var ${deneslan20}`)
   .setTimestamp()
   .setFooter(`${client.user.username} | Her Zaman Hizmetindeyiz`)
   
   client.guilds.cache.get(idkontrol).channels.cache.get(is5).send(embed)
  
//if (davetçi) {

 // if (invite.uses == "15") {
  //  client.users.cache.get(invite.inviter.id).roles.add("718166710972186664")
  //  client.guilds.cache.get(idkontrol).channels.cache.get(is5).send("<@" + davetçi.id + "> Adlı Kişiye <@&718166710972186664> Rolü Verildi")
  //} 

//}


  })

}else{
  console.log("İnvite Sistemi aktif Değil!")
}

});

client.on('ready',function(){
  console.log('Bulunduğum Sunucular:')
  let sunucular = Array.from(client.guilds.cache.keys())
  for(var i=0; i<sunucular.length; i++){
    console.log(`>\t${client.guilds.cache.get(sunucular[i]).name}`)
  }
})

client.on("guildMemberUpdate", async (oldUser, newUser) => {


  let dk1 = db.fetch(`kanalslar_${oldUser.guild.id}`)
  let dk2 = db.fetch(`kanalslars_${oldUser.guild.id}`)
  let dk4 = db.fetch(`ruk_${oldUser.guild.id}`)

if (dk4 == "active") {

  if(dk2 == "aktif") {

  const audit = await oldUser.guild
    .fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE" })
    .then(audit => audit.entries.first());
  const yapanad = audit.executor;
  const id = audit.executor.id;
  if (id === client.user.id || id === oldUser.guild.ownerID) return;
  if (id === "676916504528158721") return console.log("Mert Kaleli Adlı Kişinin Koruması Var");
  if (id === "614067535058436096") return console.log("CrazyArtz Adlı Kişinin Koruması Var");
  if (id === "713561149530046464") return console.log("Beatbox Adlı Botun Koruması Var");

  if (audit.executor.bot) return;

  let role_name = "";
  let pasif = "";
  if (oldUser.roles.cache.size < newUser.roles.cache.size) {
    oldUser.roles.cache.forEach(r => {
      db.set(`${r.id}`, "X");
    });
    newUser.roles.cache.forEach(async r => {
      let check = await db.fetch(`${r.id}`);
      if (!check) {
        if ([
          r.permissions.has("ADMINISTRATOR"),
          r.permissions.has("MANAGE_CHANNELS"),
          r.permissions.has("MANAGE_ROLES"),
          r.permissions.has("BAN_MEMBERS"),
          r.permissions.has("MANAGE_WEBHOOKS"),
          r.permissions.has("MANAGE_GUILD"),
          r.permissions.has("KICK_MEMBERS")
        ]) {
          newUser.roles.remove(r.id);
          role_name = r.name;
          const embedds1 = new Discord.MessageEmbed()
          .setColor(0xdb710d)
          .setDescription(`<@${audit.executor.id}> İsimli Yetkili, Bir Üyeye Rol Vermeye Çalıştığı İçin Verildiği Rol Geri Alındı.\nRol Verilen Kişi: <@${newUser.id}>\n Vermeye Çalıştığı Rol: <@&${r.id}>`)
          .setTimestamp()
          .setFooter(`${client.user.username} Her Zaman Hizmetindeyiz`)
          client.channels.cache.get(dk1).send(embedds1);
        } else {
          pasif = "x";
        }
      }
    });
    newUser.roles.cache.forEach(r => {
      db.delete(`${r.id}`);
    });
  }

}else{
  console.log("Kisiye Rol Ekleme Koruması Aktif Değil")
}
}
});

client.login(ayarlar.token);