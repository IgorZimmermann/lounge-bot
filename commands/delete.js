module.exports.run = async (bot, message, args) => {
	if (!message.member.hasPermission('ADMINISTRATOR'))
		return message.channel.send(
			`${message.author}: You don't have the right permissions.`
		);
	if (!args[0])
		return message.channel.send(
			`${message.author}: You have to specify the amount of messages.`
		);

	if (args[0] > 99) {
		message.channel
			.send(`${message.author}: Max amount of deletable messages is \`99\``)
			.then(m => m.delete({ timeout: 2000 }));
		message.delete({ timeout: 2000 });
	} else {
		message.channel.bulkDelete(args[0] + 1);
	}
};

module.exports.help = {
	name: 'delete',
	aliases: ['bulkDelete', 'del'],
	description: 'It deletes the specified amount of messages.',
	hasAccess: 'Admin',
	usage: '.delete <amount>'
};
