//I WILL BE BACK AFTER 5 min
const ytdlDiscord = require("ytdl-core-discord");
const Discord = require("discord.js");

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if(!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id) 
      return console.log("Müzikler Bitti")
    }
    
    try {
      var stream = await ytdlDiscord(song.url, {
        highWaterMark: 1 << 25,
      });
      
    } catch (error) {
      if(queue) {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
      
      if(error.message.includes === "copyright") {
        return message.channel.send("Bu video telifli")
      } else {
        console.error(error)
      }
    }
    
    const dispatcher = queue.connection
    .play(stream, {type: "opus"}).on("finish", () => {
      if(queue.loop) {
        let lastsong = queue.songs.shift()
        queue.songs.push(lastsong)
        module.exports.play(queue.songs[0], message)
      } else {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
    }).on("error", console.error)
    dispatcher.setVolumeLogarithmic(queue.volume / 100); //Ses
    
    
    const embed52 = new Discord.MessageEmbed()
    .setColor(0xdb710d)
    .setAuthor("Şarkı Başlatılıyor!")
    .setTitle(`${song.title}`)
    .setURL(`${song.url}`)
    .setDescription("Botumuzu Kullandığınız İçin Teşekkürler. \nThank you for using our bot.")
    .setTimestamp()

    
      queue.textChannel.send(embed52)
    
    
  }
}
