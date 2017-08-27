const { Server, OPEN } = require('uws');
const { Client } = require('discord.js');
const { port, token } = require('./config.json');

const client = new Client({
	messageCacheMaxSize: 5,
	messageCacheLifetime: 20,
	messageSweepInterval: 60000
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
	setInterval(() => {
		client.users.forEach(user => delete user);
		client.guilds.forEach(g => delete g.members);
		console.log('Clearing cache...')
	}, 300000)
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
