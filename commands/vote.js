const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	const Poll = require('../models/poll');
	if (args[0]) {
		let name = args.join(' ');
		Poll.findOne({ title: name }, (err, poll) => {
			if (!poll)
				return message.channel.send(
					`${message.author}: No poll found with that name.`
				);
			if (poll.voters.includes(message.author.id))
				return message.channel.send(
					`${message.author}: You have already voted!`
				);
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
					poll.voters.push(message.author.id);
					Poll.findOneAndUpdate({ title: name }, poll, (err, doc) => {
						message.channel.send(
							`Successful vote! View current standing with \`.poll view ${doc.title}\``
						);
					});
				});
			});
		});
	} else {
		const filter = m => m.author.id == message.author.id;
		const options = {
			time: 50000,
			max: 1,
			errors: ['time']
		};
		message.channel.send('Which poll would you like to vote on?').then(() => {
			message.channel.awaitMessages(filter, options).then(c => {
				if (c.first().content == 'cancel')
					return message.channel.send(`${message.author}: Cancelled`);
				title = c.first().content;
				Poll.findOne({ title: title }, (err, poll) => {
					if (!poll)
						return message.channel.send(
							`${message.author}: No poll found with that name.`
						);
					if (poll.voters.includes(message.author.id))
						return message.channel.send(
							`${message.author}: You have already voted!`
						);
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
							new RegExp(`^([1-${poll.choices.length}]|cancel)$`).test(
								m.content
							);

						const options = { time: 20000, max: 1, errors: ['time'] };
						message.channel.awaitMessages(filter, options).then(m => {
							if (/cancel/i.test(m.first().content))
								return message.channel.send(`${message.author}: Cancelled.`);
							poll.choices[m.first().content - 1].votes++;
							poll.voters.push(message.author.id);
							Poll.findOneAndUpdate({ title: title }, poll, (err, doc) => {
								message.channel.send(
									`Successful vote! View current standing with \`.poll view ${doc.title}\``
								);
							});
						});
					});
				});
			});
		});
	}
};

module.exports.help = {
	name: 'vote',
	aliases: [''],
	description: 'You can vote on polls with this command',
	hasAccess: 'Everyone',
	usage: '.vote ?<name>'
};
