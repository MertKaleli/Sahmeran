const { Util } = require("discord.js");
const ayarlars = require('../ayarlar.json')
var yt = ayarlars.YOUTUBE_API_KEY
const ytdl = require("ytdl-core");
const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(yt);
const { play } = require("../system/music.js") 
const Discord = require("discord.js");

var prefixs = ayarlars.prefix

exports.run = async(client, message, args) => {


  if(message.author.bot) return;
  if(message.channel.type === "dm") return console.log("Bu Sistem DM'de Kullanilamaz")




    //FIRST OF ALL WE WILL ADD ERROR MESSAGE AND PERMISSION MESSSAGE
    if (!args.length) {
      //IF AUTHOR DIDENT GIVE URL OR NAME
      return message.channel.send(`Yanlış Kullanım : ``${prefixs}play <URL> yada yazı```);
    }

    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Ses Kanalında Olman Lazım :/");
    }

    //WE WILL ADD PERMS ERROR LATER :(

    const targetsong = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const urlcheck = videoPattern.test(args[0]);

    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.channel.send("Şuanlık Playlist Desteğimiz Yok ;(");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songData = null;
    let song = null;

    if (urlcheck) {
      try {
        songData = await ytdl.getInfo(args[0]);
        song = {
          title: songData.title,
          url: songData.video_url,
          duration: songData.length_seconds
        };
      } catch (error) {
        if (message.include === "copyright") {
          return message
            .reply("Bu videoda telif var -_-").then(msg => {
              msg.delete({ timeout: 10000 })
            })
            .catch(console.error);
        } else {
          console.error(error);
        }
      }
    } else {
      try {
        const result = await youtube.searchVideos(targetsong, 1)
        songData = await ytdl.getInfo(result[0].url)
         song = {
          title: songData.title,
          url: songData.video_url,
          duration: songData.length_seconds
        };
      } catch (error) {
        console.error(error)
      }
    }
    
    if(serverQueue) {
      serverQueue.songs.push(song)

      const embed50 = new Discord.MessageEmbed()
      .setColor(0xdb710d)
      .setAuthor("Şarkı Kuyruğa Eklendi!")
      .setTitle(`${song.title}`)
      .setURL(`${song.url}`)
      .setDescription("Botumuzu Kullandığınız İçin Teşekkürler. \nThank you for using our bot.")
      .setTimestamp()
      serverQueue.textChannel.send(embed50)
    } else {
      queueConstruct.songs.push(song);
    }
    
    if(!serverQueue) message.client.queue.set(message.guild.id, queueConstruct)
    
     if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`Ses Kanalına Giriş Yapılamadı : ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send({embed: {"description": `❌ | SesKanalına Giriş Yapamadım : ${error}`, "color": "#ff2050"}}).catch(console.error);
      }
    }
    
    
  }
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["çal","p","play"],
    permLevel: 0
  };
  
  exports.help = {
    name: 'oynat',
    description: 'yardım menüsü işte',
    usage: ''
  };
  
