const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	const Poll = require('../models/poll');
	if (args[0]) {
		let name = args.join(' ');
		Poll.findOne({ title: name }, (err, poll) => {
			let pollEmbed = new discord.MessageEmbed()
				.setAuthor(bot.user.username)
				.setColor('#50B3BC')
				.setTitle(poll.title)
				.setDescription(
					"Choose the the choice you want to vote for and send a message with it's number."
				);

			poll.choices.forEach((p, i) => {
				pollEmbed.addField(`${i + 1} > ${p.title}`, p.votes);
			});
			message.channel.send(pollEmbed).then(() => {
				const filter = m =>
					m.author.id == message.author.id &&
					new RegExp(`^([1-${poll.choices.length}]|cancel)$`).test(m.content);

				const options = { time: 20000, max: 1, errors: ['time'] };
				message.channel.awaitMessages(filter, options).then(m => {
					if (/cancel/i.test(m.first().content))
						return message.channel.send(`${message.author}: Cancelled.`);
					poll.choices[m.first().content - 1].votes++;
					Poll.findOneAndUpdate({ title: name }, poll, (err, doc) => {
						message.channel.send(
							`Successful vote! View current standing with \`.poll view ${doc.title}\``
						);
					});
				});
			});
		});
	} else {
	}
};

module.exports.help = {
	name: 'vote',
	aliases: [''],
	description: 'You can vote on polls with this command',
	hasAccess: 'Everyone',
	usage: '.vote <name> <choice>'
};
