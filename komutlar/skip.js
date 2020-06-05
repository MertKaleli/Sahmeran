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
      return message.channel.send("Geçebileceğim Şarkı Yok!");
    }

    serverQueue.connection.dispatcher.end();
    message.channel.send("✔ | Şarkı geçiliyor.").then(msg => {
      msg.delete({ timeout: 10000 })
    })
  }
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["s","skip"],
    permLevel: 0
  };
  
  exports.help = {
    name: 'geç',
    description: 'yardım menüsü işte',
    usage: ''
  };
  
