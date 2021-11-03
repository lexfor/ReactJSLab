import pkg from 'pg';
import { DB_ACCESS } from '../../config';

const { Pool } = pkg;

export const pool = new Pool({
  user: DB_ACCESS.user,
  host: DB_ACCESS.host,
  database: DB_ACCESS.database,
  password: DB_ACCESS.password,
  port: DB_ACCESS.port
})