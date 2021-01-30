module.exports.run = async (bot, message, args) => {
	let author = message.author
	let content = args.join(' ')
	message.channel.send(`${author}: ${content}`)
	message.delete()
}

module.exports.help = {
	name: 'repeat',
	aliases: [''],
	description: 'Repeats what the author said',
	hasAccess: 'Everyone',
	usage: '.repeat <message>'
}
