const discord = require('discord.js');
const fs = require('fs');

const config = require('./config/config.json');
try {
	require('dotenv').config();
} catch (e) {
	console.log('Running production process...');
}
let bot = new discord.Client();

bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();

const mongoose = require('mongoose');

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-htwth.mongodb.net/test?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	err => {
		if (err) return console.error(err);
	}
);

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
	if (mongoose.connection)
		console.log(`${bot.user.username} connected to the database...`);
});

bot.on('message', async message => {
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
			cmdfile.run(bot, message, args);
		} else {
			message.channel.send(
				`I do not have such command. Use \`${bot.prefix}help\` to see all commands!`
			);
		}
	}
});

bot.login(process.env.DISCORD_TOKEN);
