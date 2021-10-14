import { promisify } from 'util';

export async function resolutionDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS resolutions (
    id VARCHAR(255),
    value VARCHAR(255),
    appointment_id VARCHAR(255),
    next_appointment_date DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id))`;
  await queryAsync(sqlQuery);
}
