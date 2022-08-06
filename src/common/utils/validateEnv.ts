import { cleanEnv, port, str, url } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    REDIS_PORT: port(),
    DB_URI: url(),
    JWT_TOKEN_ALGORITHM: str(),
    JWT_TOKEN_ISSUER: str()
  });
};

export default validateEnv;
