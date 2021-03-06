import { StatusCodes } from 'http-status-codes';

export default class ApiError extends Error {
  constructor(message, status = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = status;
  }

  get getStatus() {
    return this.status;
  }

  get getValue() {
    return this.message;
  }

}
