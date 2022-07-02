import request from 'supertest';
import { indexRoute } from '@routes/index.route';
import app from '@/app';

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', () => {
      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});
