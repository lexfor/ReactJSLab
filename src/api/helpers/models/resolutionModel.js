import { promisify } from 'util';

export async function resolutionDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  let sqlQuery = `CREATE TABLE IF NOT EXISTS resolutions (
    id VARCHAR(255),
    value VARCHAR(255),
    appointment_id VARCHAR(255),
    next_appointment_date DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id))`;
  await queryAsync(sqlQuery);

  sqlQuery = 'CREATE INDEX next_appointment_date_index ON resolutions(next_appointment_date);';
  await queryAsync(sqlQuery);
}
