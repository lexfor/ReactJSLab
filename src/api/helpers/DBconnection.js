import { Client } from 'pg';
import { DB_ACCESS } from '../../config';

export const client = new Client({
  user: DB_ACCESS.user,
  host: DB_ACCESS.host,
  database: DB_ACCESS.database,
  password: DB_ACCESS.password,
  port: DB_ACCESS.port
})