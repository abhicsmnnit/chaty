const path = require('path');
const http = require('http');

const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicPath));

const server = http.createServer(app);

const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('New connection accepted');
    
    // Send a newMessage event to the connected user
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to Chaty!',
        createdAt: new Date().getTime()
    });

    // Send a newMessage event to everyone except the connected user
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'A new user joined',
        createdAt: new Date().getTime()
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    
    socket.on('createMessage', (message) => {
        console.log('createMessage:', message);
        
        // Send a newMessage event to everyone
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });
});



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Started on port ${port}`);
});