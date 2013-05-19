var chat = {

	jq: jQuery.noConflict(true)
};

chat.jq.extend(chat, {

	el:
	{
		login: chat.jq('#login'),
		username: chat.jq('#username'),
		chatroom: chat.jq('#chatroom'),
		messages: chat.jq('#messages'),
		users: chat.jq('#users'),
		message: chat.jq('#message'),
	},

	socket: io.connect('192.168.0.20'),

	currentUser:
	{
		username: null,
	},

	start: function()
	{
		chat.el.chatroom.hide();

		chat.registerLoginEvents();
		chat.registerChatEvents();
	},

	registerLoginEvents: function()
	{
		chat.el.username.keydown(function(event)
		{
			if(event.keyCode == 13)
			{
				chat.currentUser.username = chat.el.username.val();

				chat.el.login.hide();
				chat.el.chatroom.show();

				chat.login();
			}
		});
	},

	registerChatEvents: function()
	{
		chat.socket.on('user connected', function (data)
		{
			chat.showNotice('User "'+data.newUser.username+'" has connected.');

			chat.el.users.html('');

			for(user in data.users)
			{
				var html = '';

				html += '<p class="user">';
				html += data.users[user].username;
				html += '</p>';

				chat.el.users.append(html);
			}
		});

		chat.socket.on('user disconnected', function (user)
		{
			chat.showNotice('User "'+user.username+'" has disconnected.');
		});

		chat.socket.on('new message', function(message)
		{
			chat.showMessage(message);
		});

		chat.el.message.keydown(function(event)
		{
			if(event.keyCode == 13)
			{
				chat.sendMessage(chat.el.message.val());

				chat.el.message.val('');
			}
		});
	},

	login: function()
	{
		chat.socket.emit('user connected', chat.currentUser);
	},

	sendMessage: function(message)
	{
		if(message != '')
		{
			var message = {
				author: chat.currentUser,
				content: message
			};

			console.log('Sending new message.');
			console.log(message);

			chat.socket.emit('send message', message);
		}

		else
		{
			console.log('Ignoring empty message.');
		}
	},

	showMessage: function(message)
	{
		var html = '';

		html += '<div id="message">';
		html += '<span class="username">'+message.author.username+'</span>: ';
		html += '<span class="message">'+message.content+'</span>';
		html += '</div>';

		console.log('Displaying message.');
		console.log(message);

		chat.el.messages.append(html);
	},

	showNotice: function(notice)
	{
		var html = '';

		html += '<div id="message">';
		html += '<span class="notice">'+notice+'</span>';
		html += '</div>';

		console.log('Displaying notice.');
		console.log(notice);

		chat.el.messages.append(html);
	}
});

chat.jq(chat.start);