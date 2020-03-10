const fs = require('fs');
let pollLoc = __dirname + '/polls.json';
let pollFile = require(pollLoc);

module.exports = {
	createPoll: (name, options) => {
		if (!name || !options)
			return console.log(new Error('Missing crucial argument'));

		if (pollFile.find(x => x.name == name))
			return console.log(new Error(`Poll with name ${name} already exists`));

		let pollObj = {
			name: name,
			options: []
		};

		options.forEach(o => {
			let optionObj = {
				name: o,
				votes: 0
			};
			pollObj.options.push(optionObj);
		});

		pollFile.push(pollObj);
		fs.writeFileSync(pollLoc, JSON.stringify(pollFile));
		delete require.cache[require.resolve(pollLoc)];
		pollFile = require(pollLoc);
	},
	changeVote: (name, option, value) => {
		if (!name || !option || !value)
			return console.log(new Error('Missing crucial argument'));

		pollFile
			.find(x => x.name === name)
			.options.find(x => x.name === option).votes = value;

		fs.writeFileSync(pollLoc, JSON.stringify(pollFile));
		delete require.cache[require.resolve(pollLoc)];
		pollFile = require(pollLoc);
	},
	getVotes: (name, option) => {
		return pollFile
			.find(x => x.name === name)
			.options.find(x => x.name === option).votes;
	},
	getRanking: name => {
		let pollObj = pollFile.find(x => x.name == name);
		let ranking = pollObj.options.sort((a, b) => {
			return b.votes - a.votes;
		});
		return ranking;
	},
	deletePoll: name => {
		let pollObj = pollFile.find(x => x.name == name);
		pollFile = pollFile.filter(x => {
			return x !== pollObj;
		});
		fs.writeFileSync(pollLoc, JSON.stringify(pollFile));
		delete require.cache[require.resolve(pollLoc)];
		pollFile = require(pollLoc);
	}
};
