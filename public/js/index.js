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

socket.on('newLocationMessage', (message) => {
    console.log('Location Message Received!', message);
    const li = jQuery('<li></li>');
    const a = jQuery(`<a target="_blank">My current location</a>`);
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, () => {

    });
});

jQuery('#send-location').on('click', () => {
    if(!navigator.geolocation) {
        socket.emit('createMessage', {
            from: 'User',
            text: 'No location'
        }, () => {
    
        });
        return alert('Geolocation not supported!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log('Emitting location');
        socket.emit('createLocationMessage', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
        });
    }, () => {
        socket.emit('createMessage', {
            from: 'User',
            text: 'No location'
        }, () => {
    
        });
    });
});