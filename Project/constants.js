export const MAX_LENGTH = 30;

export const MIN_LENGTH = 2;

export const STATUSES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  SERVER_ERROR: 500,
  UNAVAILABLE: 503,
  CONFLICT: 409,
  UNAUTHORISED: 401,
  FORBIDDEN: 403,
};

export const SERVER_PORT = {
  REDIS_PORT: 6379,
  SQL_PORT: 3306,
  APP_PORT: 3000,
};

export const ROLES = {
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  ADMIN: 'Admin',
};

export const NOT_AVAILABLE = 'N/A';
