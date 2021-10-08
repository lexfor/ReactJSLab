import Ajv from 'ajv';
import { NOT_AVAILABLE, STATUSES } from '../../../constants';
import {DoctorSchema} from "../schemas/DoctorSchema";

const ajv = new Ajv();

function checkDoctorMiddleware(req, res, next) {
    const validationResult = ajv.validate(DoctorSchema, req.body);
    if (!validationResult) {
        res.status(STATUSES.BAD_REQUEST).json(NOT_AVAILABLE);
    } else {
        next();
    }
}

export { checkDoctorMiddleware };
