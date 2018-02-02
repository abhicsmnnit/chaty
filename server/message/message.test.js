const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate proper message', () => {
        const from = 'Some user';
        const text = 'Some text';

        const message = generateMessage(from, text);

        expect(message).toMatchObject({ from, text });
        expect(typeof message.createdAt).toBe('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate proper geolocation message', () => {
        const from = 'Some user';
        const latitude = 1.2;
        const longitude = 1.3;
        const url = `https://google.com/maps?q=${latitude},${longitude+1}`;

        const message = generateLocationMessage(from, latitude, longitude);

        expect(message).toMatchObject({ from, url });
        expect(typeof message.createdAt).toBe('number');
    });
}); 