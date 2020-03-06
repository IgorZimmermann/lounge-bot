const discord = require('discord.js');
const fs = require('fs');

const config = require('./config/config.json');
const secret = require('./config/sercrets.json');

let bot = new discord.Client();

bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();

fs.readdir('./commands/', (err, files) => {
	let jsfiles = files.filter(f => f.split('.').pop() === 'js');
	jsfiles.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		bot.commands.set(props.help.name, props);
		props.help.aliases.forEach(alias => {
			bot.aliases.set(alias, props.help.name, props);
		});
	});
});

bot.on('ready', () => {
	setInterval(() => {
		let status =
			config.statuses[Math.floor(Math.random() * config.statuses.length)];
		bot.user.setActivity(status);
	}, 3000);
	console.log(`${bot.user.username} is online...`);
});

bot.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type === 'dm') return;

	let prefix = '.';
	let msgArray = message.content.split(' ');
	let cmd = msgArray[0];
	let args = msgArray.splice(1);

	if (cmd.startsWith(prefix)) {
		let cmdfile =
			bot.commands.get(cmd.slice(prefix.length)) ||
			bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
		if (cmdfile) {
			cmdfile.run(bot, message, args);
		} else {
			message.channel.send(
				"I don't have such command. Use the help command `.help` for all the commands."
			);
		}
	}
});

bot.login(secret.auth.token);
