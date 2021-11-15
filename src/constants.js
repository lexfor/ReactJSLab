export const MAX_LENGTH = 30;

export const MIN_LENGTH = 2;

export const SERVER_PORT = {
  REDIS_PORT: 6379,
  SQL_PORT: 5432,
  APP_PORT: 3000,
};

export const ROLES_ID = {
  DOCTOR: '61938f1a-283c-11ec-9621-0242ac130002',
  PATIENT: '5d5c9ad6-283c-11ec-9621-0242ac130002',
  ADMIN: '58ad6448-283c-11ec-9621-0242ac130002',
};

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
  Asc: 'ASC',
  Desc: 'DESC',
};

export const DATE_STATUS_TYPE = {
  Upcoming: 'upcoming',
  Outdate: 'done',
};

export const APPOINTMENTS_STATUSES = {
  waiting: 'waiting for confirmation',
  canceled: 'appointments is canceled',
  confirmed: 'appointments is confirmed',
}

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
                           SELECT STRING_AGG(specializations.specialization_name, ', ') FROM specializations
                           INNER JOIN doctors_specializations ON specializations.id = doctors_specializations.specialization_id
                           WHERE users.id = doctors_specializations.doctor_id
                         ) as specialization_name`;

export const SITE_ROOT_PATH = 'https://reactlabapi.herokuapp.com'

export const DEFAULT_PHOTO_PATH = `${SITE_ROOT_PATH}/src/public/users/images/default.jpg`;

export const SPECIALIZATIONS_ENUM = {
  surgeon: 'c43fca01-3ea9-48f5-b5d8-4d7a4705e30f',
  therapist: '902240b7-514a-48c3-a67f-6acfb1d35030',
  ophthalmologist: 'ff01ee4f-f005-48f2-830c-7dd456a1cc17',
  pediatrician: 'fbebec6f-5ec0-4dcd-8e87-2a27af771f5a',
}
