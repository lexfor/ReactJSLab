import { promisify } from 'util';

export async function appointmentDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  let sqlQuery = `CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(255),
    visit_date DATETIME,
    reason VARCHAR(255),
    note VARCHAR(255),
    patient_id VARCHAR(255),
    doctor_id VARCHAR(255),
    status VARCHAR(255),
    PRIMARY KEY (id), 
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id))`;
  await queryAsync(sqlQuery);

  sqlQuery = 'CREATE INDEX visit_date_index ON appointments(visit_date);';
  await queryAsync(sqlQuery);
}
