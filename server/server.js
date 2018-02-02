const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./message/message');

const publicPath = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('New connection accepted');
    
    // Send a newMessage event to the connected user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chaty!'));

    // Send a newMessage event to everyone except the connected user
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user joined!'));
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
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