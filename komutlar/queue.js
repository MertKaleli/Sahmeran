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
      return message.channel.send("Listede şarkı yok");
    }

    message.channel.send(
      `${serverQueue.songs
        .map((song, index) => index + 1 + ". " + song.title)
        .join("\n\n")}`,
      { split: true }
    );
  }
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["liste", "queue"],
    permLevel: 0
  };
  
  exports.help = {
    name: 'sıra',
    description: 'yardım menüsü işte',
    usage: ''
  };
  
