require("dotenv").config();

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

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
    
});


client.login(process.env.DISCORD_BOT_TOKEN);