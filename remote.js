const stream = require('stream');
let remote = new stream.Writable();
remote.start = () => {
	const express = require('express');
	const app = express();
	const hbs = require('hbs');
	const server = require('http').createServer(app);

	const config = require('./config/config.json');
	try {
		require('dotenv').config();
	} catch (e) {
		console.log('Running production process...');
	}

	remote.botStatus = 'disconnected';

	app.set('view engine', 'hbs');
	hbs.registerPartials(__dirname + '/web/views/includes/');
	app.use('/public/', express.static(__dirname + '/web/public/'));
	app.set('views', __dirname + '/web/views/');

	app.get('/', (req, res) => {
		res.render('index', {
			title: 'Home',
		});
	});

	app.get('/config/', (req, res) => {
		res.render('config', {
			title: 'Config',
			config: config,
		});
	});

	remote.io = require('socket.io')(server);

	remote.io.on('connection', (socket) => {
		socket.emit('connected');

		remote.setMaxListeners(3000);

		socket.on('send-message', (obj) => {
			remote.emit('send-message', obj);
		});

		socket.on('get-status', () => {
			socket.emit('status', remote.botStatus);
		});

		remote.on('response', (resp) => {
			socket.emit('response', resp);
		});

		remote.on('status-change', (status) => {
			remote.botStatus = status;
			socket.emit('status', remote.botStatus);
		});
	});

	remote.io.on('disconnect', () => {
		remote.emit('disconnected');
	});

	server.listen(process.env.WEB_PORT, () => {
		console.log(
			'Remote is listening at https://igors-lounge-bot.herokuapp.com...'
		);
	});
};

module.exports = remote;
