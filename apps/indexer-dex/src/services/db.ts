import Knex from 'knex';

import { config } from '../config.js';

export const knex = Knex({
  client: 'pg',
  connection: {
    database: config.DB_NAME,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    user: config.DB_USER,
  },
}); 