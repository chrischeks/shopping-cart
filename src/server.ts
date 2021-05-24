process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import validateEnv from '@utils/validateEnv';
import AuthRoute from './routes/auth.route';
import UsersRoute from './routes/user.route';
import CategoryRoute from './routes/category.route';
import ProductRoute from './routes/product.route';
import CartRoute from './routes/cart.route';

validateEnv();

const app = new App([new AuthRoute(), new UsersRoute(), new CategoryRoute(), new ProductRoute(), new CartRoute()]);
app.listen();
