const { faker } = require('@faker-js/faker');
const request = require('supertest');
const express = require('express');
const RoleModel = require('../models/Role');
const UserModel = require('../models/User');
// const connectDb =  require('../config/connectDb');

const app = express();
// connectDb();

app.use(express.json());
app.use('/auth', require('../routes/authRoutes'));

// let email = faker.internet.email();
// let name = faker.person.fullName();
// let phone = faker.phone.number();

describe('register function', () => {

  it('should return a 400 response if Email already exist', async () => {
    RoleModel.findOne = jest.fn().mockResolvedValue({})
    UserModel.findOne = jest.fn().mockResolvedValue({email : true})
    const body = {
        email: "toufikshima98@gmail.com",
        name: "toufik",
        password: 'password123',
        password_confirmation: 'password123',
        phone: 12345678,
        address: 'marrakech',
        role: '6530eae7063b3b0ff73260f2',
      };
      const response = await request(app)
        .post('/auth/register')
        .send(body);

      expect(response.statusCode).toBe(409);
      expect(response.body).toEqual({ message: 'Sorry email already exist' });
  });

    it('should return a 400 response if any required field is missing', async () => {
      const body = {
      };
      const response = await request(app)
        .post('/auth/register')
        .send(body);
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: 'All field are required' });
    });

    it('should return a 400 response if the passwords are not the same', async () => {
        const body = {
          email: "toufikshima98@gmail.com",
          name: "toufik",
          password: 'password123',
          password_confirmation: 'password456', 
          phone: 123333344,
          address: 'marrakech',
          role: '6530eae7063b3b0ff73260f2',
        };
        const response = await request(app)
          .post('/auth/register')
          .send(body);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ message: 'the password is not match the confirmation password' });
    });

    // it('should return a 400 response if Role is invalid', async () => {
    //   const body = {
    //       email,
    //       full_name,
    //       password: 'password123',
    //       password_confirmation: 'password123',
    //       phone_number,
    //       address: '123 Main St',
    //       role: 'Manager',
    //     };
    //     const response = await request(app)
    //       .post('/auth/register')
    //       .send(body);

    //     expect(response.statusCode).toBe(400);
    //     expect(response.body).toEqual({ message: 'Invalid Role' });
    // });

    
    
    it('should return a 201 response if User inserted', async () => {
      RoleModel.findOne = jest.fn().mockResolvedValue({})
      UserModel.findOne = jest.fn().mockResolvedValue(null)
      UserModel.save = jest.fn().mockResolvedValue(true);

      const body = {
          email: "toufikshima98@gmail.com",
          name: "toufik",
          password: 'password123',
          password_confirmation: 'password123',
          phone: 12356783,
          address: 'marrakech',
          role: '6530eae7063b3b0ff73260f2',
        };
        const response = await request(app)
          .post('/auth/register')
          .send(body);

        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
          message: 'Registration success, Please verify your email',
          user: expect.any(Object),
        });
  })

})