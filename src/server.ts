import App from './app';
import authRoute from '@routes/auth.route';
import indexRoute from '@routes/index.route';
import usersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([indexRoute, usersRoute, authRoute]);

app.listen();
