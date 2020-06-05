exports.run = async(client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")
    
    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Ses Kanalında Olman Gerekli!");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("Tekrar Edilecek Şarkı Yok");
    }
    
    //OOOOF
    serverQueue.loop = !serverQueue.loop
    
    
    
    message.channel.send(`Tekrar Ediliyor **${serverQueue.loop ? "Açıldı" : "Kapatıldı"}**`)
    
    
    
    
  }
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["loop"],
    permLevel: 0
  };
  
  exports.help = {
    name: 'döngü',
    description: 'Döngü açar',
    usage: ''
  };
