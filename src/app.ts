import Api from './api';
import 'dotenv/config';
import logger from './tools/logger';

const api = new Api();

api.init(process.env.STORE_PATH).then(() => {
    api.startServer();
}).catch((err) => {
    logger.error(err);
});