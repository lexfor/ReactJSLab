import { promisify } from 'util';

export async function statusesDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS statuses (
    id VARCHAR(255),
    status_name VARCHAR(255),
    PRIMARY KEY (id))`;
  await queryAsync(sqlQuery);
}
