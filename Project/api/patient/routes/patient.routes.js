import express from 'express';
import { injector } from '../../../Injector';
import {
  authenticationMiddleware,
  checkIDMiddleware,
  checkUserMiddleware,
} from '../../helpers/middleware';

const router = express();
const patientController = injector.getPatientController;

router.put('/api/patients/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await patientController.updateMyProfile(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/api/patients/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
}, async (req, res) => {
  const result = await patientController.getMyProfile(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/api/patients', async (req, res, next) => {
  checkUserMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.registerPatient(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/api/patients/:id', async (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.deletePatient(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.put('/api/patients/:id', async (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.updatePatient(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/api/patients', async (req, res) => {
  const result = await patientController.getPatients(req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
