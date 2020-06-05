exports.run = async(client, message, args) => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")

      const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Ses Kanalında Olman Gerekli!");
    }

    const serverQueue = message.client.queue.get(message.guild.id);
 if(serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume()
  
  return message.channel.send("✅ | Durmuş şarkı devam ediyor.").then(msg => {
    msg.delete({ timeout: 10000 })
  })
 }
    
    message.channel.send("Durdurulmuş Şarkı Yok.")
    
  }
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 0
  };
  
  exports.help = {
    name: 'devam',
    description: 'yardım menüsü işte',
    usage: ''
  };
  
