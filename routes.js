module.exports.start = function(express, app)
{
	app.use('/static', express.static('./public/assets'));

	app.get('/', function(request, response)
	{
		response.sendfile('./public/views/chatroom.html');
	});
}