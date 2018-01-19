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
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    
    socket.on('createMessage', (message) => {
        console.log('New message:', message);
    });
    
    socket.emit('newMessage', {
        from: 'abhinav',
        text: 'Hare Krsna!',
        createdAt: new Date().toLocaleDateString()
    });
});



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Started on port ${port}`);
});