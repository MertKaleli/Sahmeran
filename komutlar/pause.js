const Discord = require("discord.js");

exports.run = async(client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")


  const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Ses Kanalında Olman Gerekli");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("Durdurulacak Şarkı Bulamadım.");
    }
    
    if(serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause(true)
      let embed = new Discord.MessageEmbed()
      .setColor(Math.floor(Math.random()*16777215))
      .setDescription(`${message.author.username} Müziğimi Yarıda Kesti!`)
      
      return message.channel.send(embed)
  }  
  }
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'durdur',
    description: 'yardım menüsü işte',
    usage: ''
  };
  
