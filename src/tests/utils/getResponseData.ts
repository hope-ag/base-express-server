import { Response } from 'supertest';

export function getResponseData(response: Response) {
  const data = response.body.data;
  const access = data?.accessToken;
  const refreshCookie =
    (response.headers['set-cookie'] || []).find(c => c.includes('Refresh')) || '';
  const refresh = refreshCookie.split(';')[0].split('=')[1];
  const success = response.body.success;
  const message = response.body.message;
  return {
    data,
    access,
    refresh,
    success,
    message
  };
}
