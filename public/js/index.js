const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('New Message:', message);
    const element = jQuery('<li></li>');
    element.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(element);
    jQuery('[name=message]').val('');
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, () => {

    });
});