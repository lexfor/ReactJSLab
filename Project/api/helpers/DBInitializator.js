import {
  usersDefine,
  resolutionDefine,
  rolesDefine,
  specializationDefine,
  doctorSpecializationsDefine,
  appointmentDefine,
  statusesDefine,
} from './models';

export async function initializeDB(connection) {
  await rolesDefine(connection);
  await specializationDefine(connection);
  await statusesDefine(connection);

  await usersDefine(connection);
  await resolutionDefine(connection);
  await appointmentDefine(connection);
  await doctorSpecializationsDefine(connection);
}
