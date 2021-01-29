const ytdl = require('ytdl-core-discord');

module.exports = async (bot) => {
	if (!bot.config.chilledcow.isEnabled) return
	const channel1 = await bot.channels.fetch(bot.config.chilledcow.voiceId);
	const connection1 = await channel1.join();
	connection1.play(await ytdl('https://www.youtube.com/watch?v=5qap5aO4i9A'), {
		type: 'opus',
	});
};
