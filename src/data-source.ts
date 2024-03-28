import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from 'src/constants/env';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env[DB_HOST],
  port: +process.env[DB_PORT],
  database: process.env[DB_NAME],
  username: process.env[DB_USERNAME],
  password: process.env[DB_PASSWORD],
  logging: false,
  entities: [`${__dirname}/**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/migrations/**/*.{js,ts}`],
  subscribers: [`${__dirname}/subscribers/**/*.{js,ts}`],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
