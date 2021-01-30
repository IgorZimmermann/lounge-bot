$(() => {
	let href = window.location.pathname.replace(/\//g, '');
	let socket = io();
	let $remoteStatus = $('#remote-status');
	let $botStatus = $('#bot-status');
	let $content = $('.content-wrapper');

	$(`#${href}-page`).addClass('selected');

	socket.on('connected', () => {
		$remoteStatus
			.removeClass('disconnected')
			.removeClass('reconnecting')
			.addClass('connected');
	});

	socket.emit('get-status');
	socket.on('status', (stat) => {
		$botStatus.removeClass().addClass(`dot ${stat}`);
	});

	socket.on('response', (resp) => {
		let $respElem = $(`<div class="response"><p>${resp}</p></div>`);
		$content.prepend($respElem);
		setTimeout(() => {
			$respElem.hide(300);
			setTimeout(() => {
				$respElem.remove();
			}, 300);
		}, 10000);
	});

	socket.on('disconnect', () => {
		$remoteStatus
			.removeClass('connected')
			.removeClass('reconnecting')
			.addClass('disconnected');
	});

	document.querySelector('#submit-message').onclick = () => {
		let inps = document.querySelectorAll('.message-input');
		socket.emit('send-message', {
			id: inps[0].value,
			message: inps[1].value,
		});
	};
});
