import { promisify } from 'util';

export async function resolutionDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS resolutions (
    id VARCHAR(255),
    value VARCHAR(255),
    createdTime VARCHAR(255),
    patient_id VARCHAR(255),
    doctor_id VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id))`;
  await queryAsync(sqlQuery);
}
