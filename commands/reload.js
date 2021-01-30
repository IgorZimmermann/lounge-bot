module.exports.run = async (bot, message, args) => {
	if (!message.member.hasPermission('ADMINISTRATOR'))
		return message.channel.send("You're not an admin on this server.")
	if (!args[0]) return message.channel.send('You have to specify the command.')

	let command = args[0].toLowerCase().replace('.js', '')
	try {
		message.delete({ timeout: 5000 })
		delete require.cache[require.resolve(`./${command}.js`)]
		bot.commands.delete(command)
		const pull = require(`./${command}`)
		bot.commands.set(command, pull)
		message.channel
			.send(`${message.author}: Reloaded command \`${command}\``)
			.then(msg => msg.delete({ timeout: 5000 }))
	} catch (e) {
		message.channel.send(
			`${message.author}: Command \`${command}\` cannot be reloaded.`
		)
	}
}

module.exports.help = {
	name: 'reload',
	aliases: ['refresh', 'r'],
	description: 'It reloads a command file without restarting the bot.',
	hasAccess: 'Admin',
	usage: '.reload <name_of_command>'
}
