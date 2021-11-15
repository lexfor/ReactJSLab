export function doctorParse(rows) {
    return rows.map((row) => {
        const doctor = row.doctor;
        const doctorData = doctor.replace('(','').replace(')','').split(',');
        delete row.doctor;
        row.doctor = {
            first_name: doctorData[0],
            last_name: doctorData[1],
            photo: doctorData[2],
            id: doctorData[3],
            specialization_name: doctorData[4],
        }
        return row;
    });
}