const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let pollSchema = new Schema({
	title: String,
	author: Object,
	voters: [],
	createdAt: { type: Date, default: Date.now() },
	choices: [{ title: String, votes: Number }]
});

pollSchema.methods.getOrder = () => {
	return this.choices.sort((a, b) => {
		return b.votes - a.votes;
	});
};

module.exports = mongoose.model('Poll', pollSchema);
