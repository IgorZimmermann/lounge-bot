const mongoose = require('mongoose');
mongoose.connect(
	`mongodb+srv://PaperKing01:${process.env.MONGO_PASSWORD}@cluster0-htwth.mongodb.net/test?retryWrites=true&w=majority`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	err => {
		if (err) return console.error(err);
		console.log('Lounge Bot connected to database...');
	}
);
