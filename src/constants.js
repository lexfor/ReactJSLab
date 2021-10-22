export const MAX_LENGTH = 30;

export const MIN_LENGTH = 2;

export const SERVER_PORT = {
  REDIS_PORT: 6379,
  SQL_PORT: 3306,
  APP_PORT: 3000,
};

export const ROLES_ID = {
  DOCTOR: '61938f1a-283c-11ec-9621-0242ac130002',
  PATIENT: '5d5c9ad6-283c-11ec-9621-0242ac130002',
  ADMIN: '58ad6448-283c-11ec-9621-0242ac130002',
};

export const DEFAULT_PHOTO_PATH = '/src/public/users/images/default.jpg';

export const NEXT_VISIT_DAYS_DELAY = 7;

export const NOT_AVAILABLE = 'N/A';

export const SECOND_VISIT = 'repeat visit';

export const MAX_FILE_SIZE = 1000000;

export const WORK_HOURS = {
  start: 8,
  end: 20,
  step: 1,
};

export const SORT_TYPE = {
  Up: 'ASC',
  Down: 'DESC',
};

export const DATE_STATUS_TYPE = {
  Upcoming: 'upcoming',
  Outdate: 'done',
};

export const APPOINTMENTS_STATUSES = [
  'waiting for confirmation',
  'appointments canceled',
  'appointments confirmed',
];

export const SORTS = {
  dateSort: 'appointments.visit_date',
  nextDateSort: 'resolutions.next_appointment_date',
  firstNameSort: 'users.first_name',
  lastNameSort: 'users.last_name',
  specializationSort: 'specialization_name',
};

export const ROUTES = {
  PATIENTS: '/api/patients',
  DOCTORS: '/api/doctors',
  SPECIALIZATIONS: '/api/specializations',
  APPOINTMENTS: '/api/appointments',
  RESOLUTIONS: '/api/resolutions',
  STATUSES: '/api/statuses',
  AUTH: '/api/auth',
  ADMIN: '/api/admin',
  IMAGES: '/src/public/users/images',
};

export const FILES_EXTENSIONS = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const SPECIALIZATION_NAME_JOIN = `(
                           SELECT GROUP_CONCAT(specializations.specialization_name SEPARATOR ', ') FROM specializations
                           INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                           WHERE users.id = doctors_specializations.doctor_id
                         ) as specialization_name`;