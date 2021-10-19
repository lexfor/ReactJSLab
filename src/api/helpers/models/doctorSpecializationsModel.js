import { promisify } from 'util';

export async function doctorSpecializationsDefine(connection) {
  const queryAsync = promisify(connection.query).bind(connection);
  const sqlQuery = `CREATE TABLE IF NOT EXISTS doctors_specializations (
    doctor_id VARCHAR(255),
    specialization_id VARCHAR(255))`;
  await queryAsync(sqlQuery);
}
