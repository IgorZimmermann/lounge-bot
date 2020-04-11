module.exports = async (bot) => {
	const ytdl = require('ytdl-core-discord');
	const channel1 = await bot.channels.fetch('684454817187627190');
	const connection1 = await channel1.join();
	connection1.play(await ytdl('https://www.youtube.com/watch?v=5qap5aO4i9A'), {
		type: 'opus',
	});
};
