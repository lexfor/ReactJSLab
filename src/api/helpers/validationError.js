import {StatusCodes} from "http-status-codes";

export default class ValidationError extends Error {
    constructor(title = '', description = '') {
        super(title);
        this.description = description;
        this.status = StatusCodes.BAD_REQUEST;
    }

    get getValue() {
        return {
            title: `title: ${this.message}`,
            message: `message: ${this.description}`,
        };
    }

    get getStatus() {
        return this.status;
    }
}