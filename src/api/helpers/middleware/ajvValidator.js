import Ajv from 'ajv';
import ApiError from "../ApiError";
import { ajvParseErrorLog } from '../ajvParseErrorLog'
import {StatusCodes} from "http-status-codes";

const ajv = new Ajv();

export default (data, schema, req, res, next) => {
    const validateEnqueueSchema = ajv.compile(schema);
    const valid = validateEnqueueSchema(data);

    if (!valid) {
        const validationErrors = ajvParseErrorLog(
            validateEnqueueSchema.errors[0]
        );
        throw new ApiError(validationErrors, StatusCodes.BAD_REQUEST);
    }
    next();
};