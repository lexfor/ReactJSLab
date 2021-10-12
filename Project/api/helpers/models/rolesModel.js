import { promisify } from 'util';

export async function rolesDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(255),
    role_name VARCHAR(255),
    PRIMARY KEY (id))`;
  await queryAsync(sqlQuery);
}
