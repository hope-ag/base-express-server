import { authRoute } from '@/routes/auth.route';
import request from 'supertest';
import app from '@/app';

import { mockUserRegistrationData } from '../mock/data/users';
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
          .expect(422);
        // .then(res => {
        //   expect(res.body.message).toContain('email');
        //   expect(res.body.success).toBe(false);
        // });
      });
      it('should fail to register with invalid password', async () => {
        return await request(app.getServer())
          .post(authRoute.path + 'signup')
          .send(userData3)
          .expect(422);
        // .then(res => {
        //   expect(res.body.message).toContain('password');
        //   expect(res.body.success).toBe(false);
        // });
      });
    });
  });
});
