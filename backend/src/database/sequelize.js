import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT) || 5432;
const DB_SSL = process.env.DB_SSL === 'true';

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error('Missing required environment variables: DB_NAME, DB_USER, DB_PASSWORD, or DB_HOST');
}


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: DB_SSL
      ? {
        require: true,
        rejectUnauthorized: false,
      }
      : undefined,
  },
});

export default sequelize;
