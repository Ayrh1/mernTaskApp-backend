const { registerUser } = require('../controller/userController');

//MOCK User model functions 
jest.mock('../models/userModel', () => {
    //Mock User Model
    const mockUser = {
        _id: 'user_id',
        name: 'Johe Doe',
        email: 'johndoe@example.com'
    };

    return {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(mockUser),
    };
});

//Mock JWT and bycrpt 
jest.mock('jsonwebtoken', () => ({
   sign: jest.fn().mockResolvedValue('mock-token'), 
}));

const bcrypt = require('bcryptjs');

bcrypt.genSalt = jest.fn().mockResolvedValue('mock-salt');
bcrypt.hash = jest.fn().mockResolvedValue('mock-hashed-password');

//Test
test('should register a new user', async () => {
    const req = {
        body: {
            name: 'John doe',
            email: 'johndoe@example.com',
            password: 'password',
        }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
});

test('should return a 400 error if any field is missing', async () => {
    const req = {
        body: {
            name: 'John Doe',
            email: '',
            password: 'password',
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await expect(registerUser(req, res)).rejects.toThrow('All fields are mandatory');
    expect(res.status).toHaveBeenCalledWith(400);
});