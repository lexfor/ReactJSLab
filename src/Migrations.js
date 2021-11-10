import { migrate } from 'postgres-migrations';

async function migrations() {
  const dbConfig = {
    database: 'lab',
    user: 'Tim',
    password: 'TimaPassword',
    host: 'localhost',
    port: 5432,
    ensureDatabaseExists: true,
    defaultDatabase: 'lab',
  };
  await migrate(dbConfig, './src/api/helpers/migrations/');
}

migrations();
