const socket = new WebSocket('your ws server');
const messageSound = new Audio('./sounds/message.mp3');

const vue = new Vue({
	el: '#vue-wrapper',
	data: {
		blocks: []
	},
	methods: {
		cancelTTS() {
			window.speechSynthesis.cancel();
			setTimeout(() => {
				window.speechSynthesis.speak(new SpeechSynthesisUtterance('yes'));
			}, 100);
		},
		calcTime(timestamp) {
			return moment(timestamp).format('MMMM Do, h:mm a')
		}
	}
});

socket.onmessage = (e) => {
	const message = JSON.parse(e.data);

	if (message.event === 'message') {
		vue.blocks = message.data;
		messageSound.play().then(() => setTimeout(function() {
			window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${message.data[0].author} said ${message.data[0].content}`));
		}, 2000))
	} else
	if (message.event === 'readyCache') {
		vue.blocks = message.data;
	}
}
