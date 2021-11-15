import express from 'express';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
} from '../helpers/middleware';
import {ajvValidator} from '../helpers/middleware/index';
import { CreateAppointmentSchema } from '../helpers/schemas/CreateAppointmentSchema';
import { IDSchema } from '../helpers/schemas/IDSchema';
import { PaginationSchema } from '../helpers/schemas/PaginationSchema';
import {FreeTimeSchema} from "../helpers/schemas/FreeTimeSchema";

const router = express();
const appointmentsController = injector.getAppointmentsController;

router.post('/', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.body, CreateAppointmentSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await appointmentsController.createAppointment(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/:id', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await appointmentsController.deleteAppointment(req.params.id, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/:id', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.body, FreeTimeSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await appointmentsController.updateAppointment(
    req.params.id,
    req.body,
    req.userID,
  );
  res.status(result.getStatus).json(result.getValue);
});

router.get('/doctor/me', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await appointmentsController.getAppointmentsForDoctor({
    doctorID: req.userID,
    offset: req.query.offset,
    count: req.query.limit,
    name: req.query.name,
    dateStatus: req.query.dateStatus,
    sort: req.query.sortBY,
    variant: req.query.order,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/me', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await appointmentsController.getAppointmentsForPatient({
    patientID: req.userID,
    offset: req.query.offset,
    count: req.query.limit,
    name: req.query.name,
    dateStatus: req.query.dateStatus,
    sort: req.query.sortBy,
    variant: req.query.order,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/time/free', async (req, res, next) => {
  try {
    ajvValidator(req.query, FreeTimeSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await appointmentsController.getFreeAppointmentsTime(
    req.query.date,
    req.query.doctorID,
  );
  res.status(result.getStatus).json(result.getValue);
});

export default router;
