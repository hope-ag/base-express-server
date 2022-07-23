import { readFileSync } from 'fs';
import { JWT_TOKEN_ISSUER, ROOT_DIR, JWT_TOKEN_ALGORITHM } from '@common/config';
import { sign, verify } from 'jsonwebtoken';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { resolve } from 'path';

const pathToKey = (type: 'pub' | 'priv') => resolve(ROOT_DIR, `id_rsa_${type}.pem`);

const PRIV_KEY = readFileSync(pathToKey('priv'), 'utf8');
export const PUB_KEY = readFileSync(pathToKey('pub'), 'utf8');

export const createToken = (user: User, type: 'access' | 'refresh'): TokenData => {
  const dataStoredInToken: DataStoredInToken = {
    sub: user._id
  };
  //if access token is created, it will be valid for 15 minutes
  //if refresh token is created, it will be valid for 7 days
  const expiresIn: number | string = type === 'access' ? '15 minutes' : '7 days';
  return {
    expiresIn,
    token: sign(dataStoredInToken, PRIV_KEY, {
      expiresIn,
      issuer: JWT_TOKEN_ISSUER,
      algorithm: JWT_TOKEN_ALGORITHM
    })
  };
};

export const extractTokenData = (token: string): DataStoredInToken => {
  return verify(token, PUB_KEY, {
    issuer: JWT_TOKEN_ISSUER,
    algorithms: [JWT_TOKEN_ALGORITHM]
  }) as DataStoredInToken;
};

export const createCookie = (tokenData: TokenData): string => {
  return `Refresh=${tokenData.token}; HttpOnly; Max-Age=${60 * 60 * 24 * 7};`;
};
