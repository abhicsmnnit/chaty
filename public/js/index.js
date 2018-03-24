const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
    const timestamp = moment(message.createdAt).format('h:mm a');

    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: timestamp
    });

    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', (message) => {
    console.log('Location Message Received!', message);
    const timestamp = moment(message.createdAt).format('h:mm a');

    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template, {
        text: message.url,
        from: message.from,
        createdAt: timestamp
    });
    
    jQuery('#messages').append(html);
});

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    
    const messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, () => {
        messageTextbox.val('');
    });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported!');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});