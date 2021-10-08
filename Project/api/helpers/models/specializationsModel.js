import { promisify } from 'util';

export async function specializationDefine(connection) {
    const queryAsync = promisify(connection.query).bind(connection);
    const sqlQuery = `CREATE TABLE IF NOT EXISTS specializations (
    id VARCHAR(255),
    specialization_name VARCHAR(255),
    PRIMARY KEY (id))`;
    await queryAsync(sqlQuery);
}
