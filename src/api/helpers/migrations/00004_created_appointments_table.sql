CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(255),
    visit_date TIMESTAMP,
    reason VARCHAR(255),
    note VARCHAR(255),
    patient_id VARCHAR(255),
    doctor_id VARCHAR(255),
    status VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE);

CREATE INDEX visit_date_index ON appointments(visit_date);
