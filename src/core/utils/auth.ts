import {
  REFRESH_SECRET_KEY,
  ACCESS_SECRET_KEY,
  JWT_TOKEN_ISSUER
} from '@config';
import { sign, verify } from 'jsonwebtoken';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { User } from '@interfaces/users.interface';

export const createToken = (
  user: User,
  type: 'access' | 'refresh'
): TokenData => {
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id,
    role: user.role
  };
  const secretKey: string =
    type === 'refresh' ? REFRESH_SECRET_KEY : ACCESS_SECRET_KEY;
  //if access token is created, it will be valid for 10 minutes
  //if refresh token is created, it will be valid for 7 days
  const expiresIn: number | string =
    type === 'access' ? '15 minutes' : '7 days';
  return {
    expiresIn,
    token: sign(dataStoredInToken, secretKey, {
      expiresIn,
      issuer: JWT_TOKEN_ISSUER,
      algorithm: 'HS256'
    })
  };
};

export const extractTokenData = (
  token: string,
  type: 'access' | 'refresh'
): DataStoredInToken => {
  const secretKey: string =
    type === 'refresh' ? REFRESH_SECRET_KEY : ACCESS_SECRET_KEY;
  return verify(token, secretKey) as DataStoredInToken;
};

export const createCookie = (tokenData: TokenData): string => {
  return `Refresh=${tokenData.token}; HttpOnly; Max-Age=${60 * 60 * 24 * 7};`;
};
