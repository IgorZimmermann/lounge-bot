const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
	let infoEmbed = new discord.MessageEmbed()
		.setTitle('Server Info')
		.setDescription('Info about the server')
		.setColor('#4FB1BB')
		.setImage(
			'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftheultralinx.com%2F.image%2Ft_share%2FMTI5ODI1NzA5NDc1NTA2ODE5%2Fvintage-3d-gif-2gif.gif&f=1&nofb=1'
		)
		.addField('Server Name', `${message.guild.name}`)
		.addField('Server Created At', `${message.guild.createdAt}`)
		.addField('Server Owner', `${message.guild.owner}`)
		.addField('Members', `${message.guild.memberCount}`)
		.addField('Region', `${message.guild.region}`);
	message.channel.send(infoEmbed);
};

module.exports.help = {
	name: 'info',
	aliases: [''],
	description: 'Info about the server',
	hasAccess: 'Everyone',
	usage: '.info'
};
