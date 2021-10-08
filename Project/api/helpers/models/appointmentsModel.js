import { promisify } from 'util';

export async function appointmentDefine(connection) {
    const queryAsync = promisify(connection.query).bind(connection);
    const sqlQuery = `CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(255),
    date DATETIME,
    reason VARCHAR(255),
    note VARCHAR(255),
    patient_id VARCHAR(255),
    doctor_id VARCHAR(255),
    status_id VARCHAR(255),
    PRIMARY KEY (id), 
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (status_id) REFERENCES statuses(id))`;
    await queryAsync(sqlQuery);
}
