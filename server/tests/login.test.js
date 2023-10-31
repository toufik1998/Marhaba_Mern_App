const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userLogin } = require('../controllers/authController'); 
const UserModel = require('../models/User');

// Mock the dependencies
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('userLogin', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn(),
      send: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('should return an error if validation fails', async () => {
  //   const validateForms = require('../validators/validateUserForms');
  //   validateForms.validateLogin = jest.fn().mockReturnValue({ error: { details: [{ message: 'Validation error message' }] } });

  //   await userLogin(req, res);

  //   expect(res.status).toHaveBeenCalledWith(400);
  //   expect(res.json).toHaveBeenCalledWith({ error: 'Validation error message' });
  // });

  it('should return an error if the user does not exist', async () => {
    UserModel.findOne.mockResolvedValue(null);

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ status: 'failed', message: 'This account doesn\'t exist' });
  });

  it('should return an error if the password is incorrect or the account is not active', async () => {
    const user = {
      _id: 'user-id',
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashed-password',
      active: false,
      role: { name: 'client' }
    };

    UserModel.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    await userLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ status: 'failed', message: 'Email or password not valid or you don\'t activate your account' });
  });

  it('should generate a token and return success response if login is successful', async () => {
    const user = {
      _id: 'user-id',
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashed-password',
      active: true,
      role: { name: 'client' }
    };

    UserModel.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('generated-token');

    await userLogin(req, res);

    expect(res.cookie).toHaveBeenCalledWith('authToken', 'generated-token', { httpOnly: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ status: 'success', message: 'Login success', token: 'generated-token', role: 'client' });
  });

  // it('should handle exceptions and return an error if login fails', async () => {
  //   UserModel.findOne.mockRejectedValue(new Error('Unable to connect to the database'));

  //   await userLogin(req, res);

  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.send).toHaveBeenCalledWith({ status: 'failed', message: 'Unable to login' });
  //   expect(console.log).toHaveBeenCalledWith(new Error('Unable to connect to the database'));
  // });
});