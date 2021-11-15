export function patientParse(rows) {
    return rows.map((row) => {
        const patient = row.patient;
        const patientData = patient.replace('(','').replace(')','').split(',');
        delete row.patient;
        delete row.patient_id;
        delete row.doctor_id;
        row.patient = {
            first_name: patientData[0],
            last_name: patientData[1],
            photo: patientData[2],
            id: patientData[3],
        }
        return row;
    });
}