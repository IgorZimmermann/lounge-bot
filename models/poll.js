const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let pollSchema = new Schema({
	title: String,
	author: Object,
	createdAt: { type: Date, default: Date.now() },
	choices: [{ title: String, votes: Number }]
});

pollSchema.methods.getOrder = () => {
	return this.choices.sort((a, b) => {
		return b.votes - a.votes;
	});
};

pollSchema.statics.findByTitle = (title, cb) => {
	return this.model.find({ title: title }, cb);
};
module.exports = mongoose.model('Poll', pollSchema);
