const {Client, Events, GatewayIntentBits} = require('discord.js');
const {token} = require('./config.json');

const cliente = new Client({ intents: [GatewayIntentBits.Guilds]});

cliente.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

cliente.login(token);
