const { Server, OPEN } = require('uws');
const { Client } = require('discord.js');
const { port, token, disabledEvents } = require('./config.json');

const client = new Client({
	messageCacheMaxSize: 1,
	messageCacheLifetime: 1,
	messageSweepInterval: 1,
	disabledEvents
});
const server = new Server({ port }, () => {
	server.on('connection', connection => {
		console.log('Connection made!');
		console.log(`There are ${server.clients.length} connections open!`);
		connection.send(data('readyCache', messages));
	});
});
const triggerWords = ['add', 'words', 'here'];
const messages = [];

server.once('listening', () => {
	console.log(`Websocket check!`);
});

client.once('ready', () => {
	console.log(`Discord check!`);
});

client.on('message', message => {
	if (message.channel.type === 'dm' || message.author.bot) return;
	if (triggerWords.some(word => message.content.toLowerCase().includes(word))) {
		messages.unshift({
			content: message.content, 
			author: message.author.username,
			avatar: message.author.displayAvatarURL,
			where: `${message.guild.name}#${message.channel.name}`,
			timestamp: message.createdTimestamp
		});
		if (messages.length > 30) {
			messages.pop();
		}
		if (server.clients.length < 1) return;
		server.clients.forEach(client => {
			if (client.readyState === OPEN) client.send(data('message', messages));
		});
	}
});

client.login(token).catch(console.error);

function data(event, data) {
	return JSON.stringify({ event, data })
}
