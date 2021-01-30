const discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
	let reason = args.slice(1).join(' ')
	if (!args[0])
		return message.channel.send('You have to specify the user to ban.')
	if (!reason) return message.channel.send('You have to specify a reason.')
	let hasPermission = message.member.hasPermission('ADMINISTRATOR') || !message.author.hasPermission('ADMINISTRATOR') 
	if (!hasPermission)
		return message.channel.send(
			"You don't have permissions to use this command. You can report a person with `.report`."
		)
	let toBan = message.mentions.members.first()
	toBan.ban({ reason: reason }).then(() => {
		let banEmbed = new discord.MessageEmbed()
			.setTitle('Ban')
			.setColor('RED')
			.addField('Banned User', toBan)
			.addField('Banned by', message.author)
			.addField('Banned at', message.createdAt)
			.addField('Reason', reason)
		message.channel.send(banEmbed)
	})
	message.delete()
}

module.exports.help = {
	name: 'ban',
	aliases: ['b'],
	description: 'It bans the specified person',
	hasAccess: 'Admin',
	usage: '.ban <person> <reason>'
}
