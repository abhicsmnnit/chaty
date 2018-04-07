const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {

    let users;

    beforeEach(() => {
        users = new Users();

        users.users = [{
            id: '1',
            name: 'Nand Nandan Krsna',
            room: 'Vrndavan'
        }, {
            id: '2',
            name: 'Radharani',
            room: 'Vrndavan'
        }, {
            id: '3',
            name: 'Vasudev Krsna',
            room: 'Dvaraka'
        }, {
            id: '4',
            name: 'Rukmini',
            room: 'Dvaraka'
        }, {
            id: '5',
            name: 'Abhinav',
            room: 'Material World'
        }];
    });

    it('should add a new user', () => {
        users = new Users();

        const user = {
            id: '123',
            name: 'Krishna',
            room: 'Vrndavan'
        };

        const addedUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove the user', () => {
        const user = users.removeUser('5');
        expect(user).toEqual({
            id: '5',
            name: 'Abhinav',
            room: 'Material World'
        });
        expect(users.users.length).toEqual(4);
    });

    it('should not remove the user', () => {
        const user = users.removeUser('50');
        expect(user).toBeUndefined();
        expect(users.users.length).toEqual(5);
    });

    it('should find the user', () => {
        const user = users.getUser('1');
        expect(user).toEqual({
            id: '1',
            name: 'Nand Nandan Krsna',
            room: 'Vrndavan'
        });
    });

    it('should not find the user', () => {
        const user = users.getUser('10');
        expect(user).toBeUndefined();
    });

    it('should return the names of the residents of Vrndavan', () => {
        const vrndavanVasis = users.getUsers("Vrndavan");
        expect(vrndavanVasis).toEqual(['Nand Nandan Krsna', 'Radharani']);
    });

    it('should return the names of the residents of Dvaraka', () => {
        const vrndavanVasis = users.getUsers("Dvaraka");
        expect(vrndavanVasis).toEqual(['Vasudev Krsna', 'Rukmini']);
    });
});