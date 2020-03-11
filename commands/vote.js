module.exports.run = async (bot, message, args) => {
	let name = args[0];
	let option = args[1];

	let voteCount = bot.polls.getVotes(name, option) + 1;
	bot.polls.changeVote(name, option, voteCount);
	message.channel.send(
		`${message.author}: Voted for ${option} in ${name}. View details with \`.poll view ${name}\`.`
	);
};

module.exports.help = {
	name: 'vote',
	aliases: [''],
	description: 'You can vote on polls with this command',
	hasAccess: 'Everyone',
	usage: '.vote <name> <choice>'
};
