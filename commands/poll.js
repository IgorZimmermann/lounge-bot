const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	const Poll = require('../models/poll');
	if (args[0] == 'create') {
		let pollObj = {
			author: message.author,
			createdAt: message.createdAt,
			choices: []
		};

		const filter = m => m.author.id == message.author.id;
		const options = {
			time: 50000,
			max: 1,
			errors: ['time']
		};
		message.channel
			.send('What title would you like to give the poll?')
			.then(msg => {
				message.channel.awaitMessages(filter, options).then(c => {
					if (c.first().content == 'cancel')
						return message.channel.send(`${message.author}: Cancelled`);
					c.first().delete();
					msg.delete();
					pollObj.title = c.first().content;
					message.channel
						.send(
							'What choices would you like to create? (separate with a `,`)'
						)
						.then(msg2 => {
							message.channel.awaitMessages(filter, options).then(m => {
								if (m.first().content == 'cancel')
									return message.channel.send(`${message.author}: Cancelled`);
								m.first().delete();
								msg2.delete();
								m.first()
									.content.split(',')
									.forEach(p => pollObj.choices.push({ title: p, votes: 0 }));

								new Poll(pollObj).save((e, doc) =>
									message.channel.send(
										`${message.author} created a poll named ${doc.title}. To view details use \`.poll view ${doc.title}\``
									)
								);
							});
						});
				});
			});
	} else if (args[0] == 'view') {
		let poll;
		if (!args[1]) {
			Poll.find({}, (err, polls) => {
				let pollsEmbed = new discord.MessageEmbed()
					.setAuthor(bot.user.username)
					.setColor('#50B3BC')
					.setDescription(
						"Choose the poll you want to view. Reply with it's number!"
					);
				let titleArray = [];
				polls.forEach((p, i) => {
					titleArray.push(p.title);
					pollsEmbed.addField(
						`**${i + 1} > ${p.title}**`,
						p.choices.map(x => x.title).join(',\n')
					);
				});

				const filter = m =>
					m.author.id == message.author.id &&
					new RegExp(`^([1-${polls.length}]|cancel)$`).test(m.content);

				const options = { time: 20000, max: 1, errors: ['time'] };
				message.channel.send(pollsEmbed).then(msg => {
					message.channel
						.awaitMessages(filter, options)
						.then(m => {
							if (/cancel/i.test(m.first().content))
								return message.channel.send(`${message.author}: Cancelled`);
							m.first().delete();
							msg.delete();
							Poll.findOne(
								{ title: titleArray[m.first().content - 1] },
								(err, poll) => {
									if (!poll)
										return message.channel.send(
											`${message.author}: No poll found.`
										);
									let pollEmbed = new discord.MessageEmbed()
										.setAuthor(bot.user.username)
										.setColor('#50B3BC')
										.setTitle(poll.title);

									poll.choices.forEach(p => {
										pollEmbed.addField(p.title, p.votes);
									});

									message.channel.send(pollEmbed);
								}
							);
						})
						.catch(() =>
							message.channel.send(`${message.author}: Ran out of time.`)
						);
				});
			});
		} else {
			args.shift();
			Poll.findOne({ title: args.join(' ') }, (err, poll) => {
				if (!poll)
					return message.channel.send(`${message.author}: No poll found.`);
				let pollEmbed = new discord.MessageEmbed()
					.setAuthor(bot.user.username)
					.setColor('#50B3BC')
					.setTitle(poll.title);

				poll.choices.forEach(p => {
					pollEmbed.addField(p.title, p.votes);
				});

				message.channel.send(pollEmbed);
			});
		}
	}
};

module.exports.help = {
	name: 'poll',
	aliases: ['p'],
	description: 'You can create and view current polls',
	hasAccess: 'Admin',
	usage: '.poll <create/view> ?<name_of_poll>'
};
