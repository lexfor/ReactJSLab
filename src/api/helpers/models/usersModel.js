import { promisify } from 'util';

export async function usersDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  let sqlQuery = `CREATE TABLE IF NOT EXISTS users (
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

  sqlQuery = 'CREATE INDEX first_name_index ON users(first_name);';
  await queryAsync(sqlQuery);

  sqlQuery = 'CREATE INDEX last_name_index ON users(last_name);';
  await queryAsync(sqlQuery);
}
