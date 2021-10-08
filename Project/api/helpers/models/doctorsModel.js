import { promisify } from 'util';

export async function doctorDefine(connection) {
    const queryAsync = promisify(connection.query).bind(connection);
    const sqlQuery = `CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    user_id VARCHAR(255),
    PRIMARY KEY (id), 
    FOREIGN KEY (user_id) REFERENCES users(id))`;
    await queryAsync(sqlQuery);
}
