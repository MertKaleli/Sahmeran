const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {


  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
    
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send("Müziğin Sesini Ayarlamak İçin **Yönetici** İzinine Sahip Olman Gerekli!")
    }
    
    let embed = new MessageEmbed()
    .setColor(Math.floor(Math.random()*16777215));

    
    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      embed.setAuthor("Bir Ses Kanalında Olman Gerekiyor!")
      return message.channel.send(embed);
    }
    
     const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      embed.setAuthor("Şuanda Çalan Şarkı Yok!")
      return message.channel.send(embed);
    }
    
    if(!args[0]) {
      embed.setAuthor(`Ses Seviyesini Ayarlamak İçin ş!ses [Miktar]`)
      return message.channel.send(embed)
    }
    
    if(isNaN(args[0])) {
      embed.setAuthor("Sadece Rakam Girebilirsiniz!")
      return message.channel.send(embed)
    }
    
    if(args[0] > 100) {
      embed.setAuthor("Şarkı Sesi Max `100` Olabilir")
      return message.channel.send(embed)
    }
    
    serverQueue.volume = args[0]
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100)
    embed.setDescription(`Müzik Sesi ${args[0]} Olarak Ayarlandı`)
    message.channel.send(embed)
    
  };

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["ses", "v"],
    permLevel: 0
  };
  
  exports.help = {
    name: 'volume',
    description: 'yardım menüsü işte',
    usage: ''
  };
  