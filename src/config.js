import dotenv from 'dotenv';
import { SERVER_PORT } from './constants';

dotenv.config();

const env = process.env.NODE_ENV;

const production = {
  app: {
    port: parseInt(process.env.PORT, 10) || SERVER_PORT.APP_PORT,
  },

  storage: {
    host: process.env.STORAGE_HOST,
    port: SERVER_PORT.SQL_PORT,
  },
};

const config = {
  production,
};

const envConfig = config[env];
export { envConfig };

const DB_ACCESS = {
  host: process.env.STORAGE_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: SERVER_PORT.SQL_PORT,
  database: process.env.DB_DATABASE,
};

export { DB_ACCESS };
