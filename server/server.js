const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./message/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./users/users');

const publicPath = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);
const users = new Users();

const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('New connection accepted');

    socket.on('join', (params, callback) => {
        if (isRealString(params.name) && isRealString(params.room)) {
            socket.join(params.room);
            users.addUser(socket.id, params.name, params.room);

            // Send a notification to everyone in the room to add the user to their lists
            io.to(params.room).emit('updateUserList', users.getUsers(params.room));

            // Send a newMessage event to the connected user
            socket.emit('newMessage', generateMessage('Admin', `Hi ${params.name}! Welcome to ${params.room}! (Powered by Chaty!)`));

            // Send a newMessage event to everyone in the room except the connected user
            socket.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined!`));

            callback();
        } else {
            callback('Name & Room are required!');
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUsers(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left the room!`));
        }
    });

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage:', message);

        // Send a newMessage event to everyone (including the current connection)
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        console.log('createLocationMessage:', coords);

        // Send a newLocationMessage event to everyone (including the current connection)
        io.emit('newLocationMessage', generateLocationMessage('User', coords.latitude, coords.longitude));
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Started on port ${port}`);
});