import {
  userDefine,
  patientDefine,
  resolutionDefine,
  doctorDefine,
  adminDefine,
  specializationDefine,
  doctorSpecializationsDefine,
  appointmentDefine,
  statusesDefine,
} from './models';

export async function initializeDB(connection) {
  await userDefine(connection);
  await specializationDefine(connection);
  await patientDefine(connection);
  await doctorDefine(connection);
  await adminDefine(connection);
  await resolutionDefine(connection);
  await statusesDefine(connection);
  await appointmentDefine(connection);
  await doctorSpecializationsDefine(connection);
}
