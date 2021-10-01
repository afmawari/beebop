require("dotenv").config();
const { Client, Intents, Message } = require('discord.js');
const { MessageHandler } = require('./messageHandler');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});

client.on('ready', () => {
    console.log(`${client.user.username} logged in to server`);
    client.user.setPresence({
        activities: [{
            name: "?help for help"
        }],
        status: "online"
    });
});

client.on('messageCreate', (message) => {
    MessageHandler(client, message);
});


client.login(process.env.DISCORD_BOT_TOKEN);