const { MusicPlayer } = require('./musicService');

var MessageHandler = function(client, message) {
    var content = message.content;
    var channelId = message.channelId;
    var musicPlayer = new MusicPlayer();

    if(content.startsWith("?help")) {
        client.channels.cache.get(channelId).send("I don't help bitches");
    } else if(content.startsWith("!play")) {
        musicPlayer.addSong(message);
    } else if(content.startsWith("!skip")) {
        // Skip track
    } else if(content.startsWith("!stop")) {
        // Stop playing
    } else if(content.startsWith("!clear")) {
        // clear all tracks from playlist
    }
}

var isValidHttpUrl = function(value) {
    let url;

    try {
        url = new URL(value);
    } catch(_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = { MessageHandler };