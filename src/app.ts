import Api from './api';
import 'dotenv/config';

const api = new Api();

void api.init(process.env.STORE_PATH);
api.startServer();