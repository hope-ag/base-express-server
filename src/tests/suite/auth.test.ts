import { authRoute } from '@/routes/auth.route';
import request from 'supertest';
import app from '@/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { initDbConnection } from '../utils/db';

let dbConnection: any;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  const db = await initDbConnection();
  dbConnection = db.connection.connection;
  mongoServer = db.mongoServer;
});

afterAll(async () => {
  await dbConnection.close();
  await mongoServer.stop();
});

import { mockUserRegistrationData } from '../mock/data/users';
import { getResponseData } from '../utils/getResponseData';
const userData1 = mockUserRegistrationData();

describe('Testing Auth', () => {
  describe('Input validations', () => {
    const userData2 = { ...userData1, email: 'b' };
    const userData3 = { ...userData1, password: 'a' };
    describe('[POST] /signup', () => {
      it('should fail to register with invalid email', async () => {
        return await request(app.getServer())
          .post(authRoute.path + 'signup')
          .send(userData2)
          .expect(422)
          .then(res => {
            expect(res.body.message).toContain('email');
            expect(res.body.success).toBe(false);
          });
      });
      it('should fail to register with invalid password', async () => {
        return await request(app.getServer())
          .post(authRoute.path + 'signup')
          .send(userData3)
          .expect(422)
          .then(res => {
            expect(res.body.message).toContain('password');
            expect(res.body.success).toBe(false);
          });
      });
    });
  });
  describe('signup process', () => {
    describe('[POST] /signup', () => {
      it('should register successfully', async () => {
        return await request(app.getServer())
          .post(authRoute.path + 'signup')
          .send(userData1)
          .expect(201)
          .then(res => {
            expect(res.body.data).toBeDefined();
            expect(res.body.success).toBe(true);
          });
      });
      it('should fail to register if email already exists', async () => {
        return await request(app.getServer())
          .post(authRoute.path + 'signup')
          .send(userData1)
          .expect(409)
          .then(res => {
            expect(res.body.message).toContain('Email');
            expect(res.body.success).toBe(false);
          });
      });
    });
  });
  describe('login process', () => {
    let accessToken = '';
    let refreshToken = '';
    describe('[POST] /login', () => {
      it('should fail to login with invalid email or password', async () => {
        const wrongUserData = { ...userData1, email: userData1.email + 'a' };
        return await request(app.getServer())
          .post(authRoute.path + 'login')
          .send(wrongUserData)
          .expect(401)
          .then(res => {
            const { data, access, refresh, message, success } = getResponseData(res);
            expect(data).toBeFalsy();
            expect(typeof message).toBe('string');
            expect(access).toBe(undefined);
            expect(refresh).toBeFalsy();
            expect(success).toBe(false);
          });
      });
      it('should login successfully', async () => {
        return await request(app.getServer())
          .post(authRoute.path + 'login')
          .send(userData1)
          .expect(200)
          .then(res => {
            const { data, access, refresh } = getResponseData(res);
            accessToken = access;
            refreshToken = refresh;
            expect(data).toBeDefined();
            expect(typeof accessToken).toBe('string');
            expect(typeof refreshToken).toBe('string');
            expect(accessToken.length).toBeGreaterThan(0);
            expect(refreshToken.length).toBeGreaterThan(0);
            expect(res.body.success).toBe(true);
          });
      });
      it('should get a new access token with provided refresh token', async () => {
        return await request(app.getServer())
          .post(authRoute.path + 'refresh')
          .set('Cookie', `Refresh=${refreshToken}`)
          .set('Accept-Language', 'en')
          .expect(200)
          .then(res => {
            const { data, access } = getResponseData(res);
            expect(typeof access).toBe('string');
            expect(access.length).toBeGreaterThan(0);
            expect(res.body.success).toBe(true);
            expect(data.user).toBeDefined();
            accessToken = access;
          });
      });
    });
  });
});
