const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	if (args[0] == 'create') {
		let name = args[1];
		args.splice(0, 2);
		let choices = args;

		bot.polls.createPoll(name, choices);
		message.channel.send(
			`${message.author}: Created a new poll called ${name}. View details with \`.poll view ${name}\`.`
		);
	} else if (args[0] == 'view') {
		let name = args[1];
		let poll = bot.polls.getPoll(name);

		let pollEmbed = new discord.MessageEmbed()
			.setTitle(name)
			.setAuthor(bot.user.username)
			.setColor('#4FB1BB');
		poll.options.forEach(o => pollEmbed.addField(o.name, o.votes));
		message.channel.send(pollEmbed);
	}
};

module.exports.help = {
	name: 'poll',
	aliases: ['p'],
	description: 'You can create and view current polls',
	hasAccess: 'Admin',
	usage: '.poll <create/view> <name_of_poll> ?<poll_choices>'
};
