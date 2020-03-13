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
		let polls = bot.polls.getAllPolls();
		let pollsEmbed = new discord.MessageEmbed()
			.setAuthor(bot.user.username)
			.setColor('#50B3BC')
			.setDescription(
				"Choose the poll you want to view. Reply with it's number!"
			);
		polls.forEach((p, i) => {
			pollsEmbed.addField(
				`**${i + 1} > ${p.name}**`,
				bot.polls.getAllOptionNames(p.name).join(',\n')
			);
		});

		message.channel.send(pollsEmbed);
		let collector = message.channel.createMessageCollector(
			m => {
				return (
					m.author.id == message.author.id &&
					new RegExp(`^([1-${Number(polls.length + 1)}]|cancel)$`, 'i').test(
						m.content
					)
				);
			},
			{ time: 20000, max: 1 }
		);

		collector.on('collect', m => {
			if (/cancel/i.test(m.content)) return collector.stop('cancelled');
			let id = m.content;
			let poll = bot.polls.getAllPolls()[id - 1];

			let pollEmbed = new discord.MessageEmbed()
				.setTitle(poll.name)
				.setAuthor(bot.user.username)
				.setColor('#4FB1BB');
			poll.options.forEach(o => pollEmbed.addField(o.name, o.votes));
			message.channel.send(pollEmbed);
		});

		collector.on('end', (_, reason) => {
			if (['time', 'cancelled'].includes(reason))
				return message.channel.send(`${message.author}: Cancelled selection.`);
		});
	}
};

module.exports.help = {
	name: 'poll',
	aliases: ['p'],
	description: 'You can create and view current polls',
	hasAccess: 'Admin',
	usage: '.poll <create/view> <name_of_poll> ?<poll_choices>'
};
