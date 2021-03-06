use lab;

CREATE TABLE IF NOT EXISTS resolutions (
    id VARCHAR(255),
    value VARCHAR(255),
    appointment_id VARCHAR(255),
    next_appointment_date DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id));

CREATE INDEX next_appointment_date_index ON resolutions(next_appointment_date);
