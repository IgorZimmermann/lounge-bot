module.exports.run = async (bot, message, args) => {
	let author = message.author;
	message.channel.send(`Hello, ${author}!`);
};

module.exports.help = {
	name: 'hello',
	aliases: ['hi', 'howdy', 'hola'],
	description: 'The bot says hello to you.',
	hasAccess: 'Everyone',
	usage: '.hello'
};
