import express from 'express';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  checkIDMiddleware,
  createAppointmentMiddleware,
  paginationMiddleware,
} from '../helpers/middleware';

const router = express();
const appointmentsController = injector.getAppointmentsController;

router.post('/', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  createAppointmentMiddleware(req, res, next);
}, async (req, res) => {
  const result = await appointmentsController.createAppointment(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await appointmentsController.deleteAppointment(req.params.id, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await appointmentsController.updateAppointment(
    req.params.id,
    req.body,
    req.userID,
  );
  res.status(result.getStatus).json(result.getValue);
});

router.get('/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await appointmentsController.getAppointmentsForDoctor({
    doctorID: req.userID,
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await appointmentsController.getAppointmentsForPatient({
    patientID: req.userID,
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    dateStatus: req.query.dateStatus,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/time/free', async (req, res, next) => {
  next();
}, async (req, res) => {
  const result = await appointmentsController.getFreeAppointmentsTime(
    req.query.date,
    req.query.doctorID,
  );
  res.status(result.getStatus).json(result.getValue);
});

export default router;
