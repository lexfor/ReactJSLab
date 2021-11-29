import express from 'express';
import { upload } from '../helpers/fileUpload';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  photoMiddleware,
} from '../helpers/middleware';
import { ROUTES } from '../../constants';
import {ajvValidator} from '../helpers/middleware/index';
import { ChangePatientSchema } from '../helpers/schemas/ChangePatientSchema';
import { UserSchema } from '../helpers/schemas/UserSchema';
import { IDSchema } from '../helpers/schemas/IDSchema';
import { PaginationSchema } from '../helpers/schemas/PaginationSchema';

const router = express();
const patientController = injector.getPatientController;

router.patch(`${ROUTES.PATIENTS}/me`, upload.single('avatar'), async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    photoMiddleware(req, res);
    ajvValidator(req.body, ChangePatientSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await patientController.updateMyProfile(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.PATIENTS}/me`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    next();
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await patientController.getMyProfile(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.post(`${ROUTES.ADMIN}/patients`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.body, UserSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await patientController.createPatient(req.body, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.delete(`${ROUTES.ADMIN}/patients/:id`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await patientController.deletePatient(req.params.id, req.userID);
  console.log(result);
  res.status(result.getStatus).json(result.getValue);
});

router.patch(`${ROUTES.ADMIN}/patients/:id`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await patientController.updatePatient(req.params.id, req.body, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.ADMIN}/patients`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    console.log(e);
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await patientController.getPatients({
    offset: req.query.offset,
    count: req.query.limit,
    name: req.query.name,
    sort: req.query.sortBy,
    variant: req.query.order,
  }, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
