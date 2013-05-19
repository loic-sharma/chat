module.exports.start = function(server)
{
	var users = [];

	io = require('socket.io').listen(server);

	io.sockets.on('connection', function(socket)
	{
		socket.on('user connected', function(user)
		{
			users.push(user);
			users.sort();

			io.sockets.emit('user connected', { newUser: user, users: users });
		});

		socket.on('send message', function(message)
		{
			io.sockets.emit('new message', message);
		});

		socket.on('disconnect', function(data)
		{

			console.log("DISCONNECTED");
			console.log(data);

			io.sockets.emit('disconnected', { username: 'username' });
		});
	});
};