import userModel from '@/database/models/users';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStatic } from 'passport';
import { User } from '@/interfaces/users.interface';
import { extractTokenData, PUB_KEY } from '@/common/utils/tokens';
import CookieStrategy from 'passport-cookie';
import { Request } from 'express';
import { JWT_TOKEN_ISSUER, JWT_TOKEN_ALGORITHM } from '@common/config';

export const configureAuthStrategies = (passport: PassportStatic) => {
  passport
    .use(
      new Strategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: PUB_KEY,
          jsonWebTokenOptions: {
            issuer: JWT_TOKEN_ISSUER,
            algorithms: [JWT_TOKEN_ALGORITHM]
          }
        },
        function (jwt_payload, done) {
          userModel.findById(jwt_payload.sub, (err: Error, user: User) => {
            if (err) {
              return done(err, false);
            }
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        }
      )
    )
    .use(
      new CookieStrategy(
        {
          cookieName: 'Refresh',
          signed: false,
          passReqToCallback: true
        },
        (req: Request, token: string, done: VerifiedCallback) => {
          const { sub = '' } = extractTokenData(token);
          userModel.findById(sub, (err: Error, user: User) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false);
            }
            return done(null, user);
          });
        }
      )
    );
};
