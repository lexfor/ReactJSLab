import express from 'express';
import { injector } from '../../../Injector';
import {
  authenticationMiddleware, checkIDMiddleware,
} from '../../helpers/middleware';

const router = express();
const appointmentsController = injector.getAppointmentsController;

router.post('/', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
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

router.put('/:id', async (req, res, next) => {
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
  next();
}, async (req, res) => {
  const result = await appointmentsController.getAppointmentsForDoctor(req.userID, req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/patient/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await appointmentsController.getAppointmentsForPatient(req.userID, req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
