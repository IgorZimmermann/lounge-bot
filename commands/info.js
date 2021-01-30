const discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
	let infoEmbed = new discord.MessageEmbed()
		.setTitle('Server Info')
		.setDescription('Info about the server')
		.setColor('#4FB1BB')
		.setThumbnail(message.guild.iconURL())
		.addField('Server Name', `${message.guild.name}`)
		.addField('Server Created At', `${message.guild.createdAt}`)
		.addField('Server Owner', `${message.guild.owner}`)
		.addField('Members', `${message.guild.memberCount}`)
		.addField('Region', `${message.guild.region}`)
	message.channel.send(infoEmbed)
}

module.exports.help = {
	name: 'info',
	aliases: [''],
	description: 'Info about the server',
	hasAccess: 'Everyone',
	usage: '.info'
}
