import Api from './api';
import 'dotenv/config';

const api = new Api();

void api.init();
api.startServer();