const discord = require('discord.js');
const fs = require('fs');

const config = require('./config/config.json');
try {
	require('dotenv').config();
} catch (e) {
	console.log('Running production process...');
}

const ping = require('ping');
setInterval(() => {
	ping.sys.probe('https://igors-lounge-bot.herokuapp.com/', (b) => {
		console.log('Pinged web remote: ' + b);
	});
}, 7200000);

let bot = new discord.Client();

bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();

bot.config = config

const remote = require('./remote');
remote.start();

fs.readdir('./commands/', (err, files) => {
	let jsfiles = files.filter((f) => f.split('.').pop() === 'js');
	jsfiles.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		bot.commands.set(props.help.name, props);
		props.help.aliases.forEach((alias) => {
			bot.aliases.set(alias, props.help.name, props);
		});
	});
});

let status = 'disconnected';
bot.on('ready', async () => {
	status = 'connected';
	setInterval(() => {
		let status =
			config.statuses[Math.floor(Math.random() * config.statuses.length)];
		bot.user.setActivity(status);
	}, 3000);
	console.log(`${bot.user.username} is online...`);
	await require('./services/chilledcow')(bot);
});

remote.on('get-status', () => {
	remote.emit('status', status);
});

remote.on('send-message', async (obj) => {
	let channel = await bot.channels.fetch(obj.id);
	channel.send(obj.message).then((m) => {
		remote.emit('response', `Successfully sent a message with iD: ${m.id}`);
	});
});

bot.on('message', async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;

	bot.prefix = process.env.DISCORD_PREFIX;
	let msgArray = message.content.split(' ');
	let cmd = msgArray[0];
	let args = msgArray.splice(1);

	if (cmd.startsWith(bot.prefix)) {
		let cmdfile =
			bot.commands.get(cmd.slice(bot.prefix.length)) ||
			bot.commands.get(bot.aliases.get(cmd.slice(bot.prefix.length)));
		if (cmdfile) {
			remote.emit('bot-command', cmdfile);
			cmdfile.run(bot, message, args);
		} else {
			message.channel.send(
				`I do not have such command. Use \`${bot.prefix}help\` to see all commands!`
			);
		}
	}
});

bot.login(process.env.DISCORD_TOKEN);
