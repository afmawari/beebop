const ytdl = require("ytdl-core");
const {
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus } = require('@discordjs/voice');             

const MusicPlayerStates = {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2
}

var MusicPlayer = function(client) {
    this.client = client;
    this.state = MusicPlayerStates.STOPPED;
    this.queue = new Map(); // Server map

    this.addSong = async function(message) {
        const voiceChannel = message.member.voice.channel;
        console.log(message);
        console.log(message.member);
        console.log(message.member.voice);
        if(!voiceChannel) {
            return message.channel.send(
                "Join a voice channel to play music"
            );
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
                "I don't have permissions to speak in your voice channel"
            );
        }

        const serverQueue = this.queue.get(message.guild.id);
        const args = message.content.split(" ");

        if(args[1]) {
            const songInfo = await ytdl.getInfo(args[1]);
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };

            if(serverQueue) {
                serverQueue.songs.push(song);
                return message.channel.send(`${song.title} was added to the playlist`)
            } else {
                const guildQueue = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: MusicPlayerStates.PLAYING
                };

                guildQueue.songs.push(song);
                this.queue.set(message.guild.id, guildQueue);

                try {
                    guildQueue.connection = await connectToChannel(voiceChannel);
                    this.play(message.guild, guildQueue.songs[0]);
                    
                  } catch (err) {
                    console.log(err);
                    this.queue.delete(message.guild.id);
                    return message.channel.send(err);
                  }
            }
        }
    }

    this.play = function(guild, song) {
        const serverQueue = this.queue.get(guild.id);
        if(!song) {
            serverQueue.voiceChannel.leave();
            this.queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .connection("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .songs("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Playing: ${song.title}`);
    }

    this.skip = function(message) {

    }
    
    this.stop = function(message) {
    
    }
    
    this.clear = function(message) {
        
    }
}

async function connectToChannel(voiceChannel) {
	const connection = joinVoiceChannel({
		channelId: voiceChannel.id,
		guildId: voiceChannel.guild.id,
		adapterCreator: voiceChannel.guild.voiceAdapterCreator
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}


module.exports = { MusicPlayer };
