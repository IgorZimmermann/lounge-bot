const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	let reason = message.content.replace(`.ban ${args[0]} `, '');
	if (!args[0])
		return message.channel.send('You have to specify the user to ban.');
	if (!reason) return message.channel.send('You have to specify a reason.');
	let hasPermission = message.member.hasPermission('ADMINISTRATOR');
	if (!hasPermission)
		return message.channel.send(
			"You don't have permissions to use this command. You can report a person with `.report`."
		);
	let toBan = message.mentions.members.first();
	toBan.ban({ reason: reason }).then(() => {
		let reportEmbed = new discord.MessageEmbed()
			.setTitle('Ban')
			.setColor('RED')
			.addField('Banned User', toBan)
			.addField('Banned by', message.author)
			.addField('Banned at', message.createdAt)
			.addField('Reason', reason);
		bot.channels.fetch('685944369500782625').then(c => {
			c.send(reportEmbed);
		});
	});
	message.delete();
};

module.exports.help = {
	name: 'ban',
	aliases: ['b'],
	description: 'It bans the specified person',
	hasAccess: 'Admin',
	usage: '.ban <person> <reason>'
};
