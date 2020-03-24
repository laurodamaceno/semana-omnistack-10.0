const socketio = require('socket.io');

const parseStringAsArray = require('./controllers/utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connection = [];

exports.setupWebsocket = (server) => {
	io = socketio(server);

	io.on('connection', socket => {
		const { latitude, longitude, techs } = socket.handshake.query;

		/*
		setTimeout(() => {
			socket.emit('message', 'Hello OmniStack')
		}, 3000);
		*/

		connection.push({
			id: socket.id,
			coordinates: {
				latitude: Number(latitude),
				longitude: Number(longitude),
			},
			techs: parseStringAsArray(techs),
		});
	});
};

exports.findConnections = ( coordinates, techs ) => {
	return connection.filter(connection => {
		return calculateDistance(coordinates, connection.coordinates) < 10
			&& connection.techs.some(item => techs.includes(item))
	});
};

exports.sendMessage = (to, message, data) => {
	to.forEach(connection => {
		io.to(connection.id).emit(message, data);
	});
};