import { promisify } from 'util';

export async function usersDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    photo VARCHAR(255),
    login VARCHAR(255),
    password VARCHAR(255),
    role_id VARCHAR(255),
    PRIMARY KEY (id), 
    FOREIGN KEY (role_id) REFERENCES roles(id))`;
  await queryAsync(sqlQuery);
}
