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
	let toKick = message.mentions.members.first()
	toKick.kick({ reason: reason }).then(() => {
		let kickEmbed = new discord.MessageEmbed()
			.setTitle('Kick')
			.setColor('RED')
			.addField('Kicked User', toKick)
			.addField('Kicked by', message.author)
			.addField('Kicked at', message.createdAt)
			.addField('Reason', reason)
		message.channel.send(kickEmbed)
	})
	message.delete()
}

module.exports.help = {
  "name": "kick",
  "aliases": ["k","kirug"],
  "description": "It kicks the mentioned user",
  "hasAccess": "Admin",
  "usage": ".kick <member> <reason>"
}