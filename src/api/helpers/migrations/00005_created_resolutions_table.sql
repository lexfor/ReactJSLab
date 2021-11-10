CREATE TABLE IF NOT EXISTS resolutions (
    id VARCHAR(255),
    value VARCHAR(255),
    appointment_id VARCHAR(255),
    next_appointment_date TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE);

CREATE INDEX next_appointment_date_index ON resolutions(next_appointment_date);
