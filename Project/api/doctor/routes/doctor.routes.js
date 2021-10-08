import express from 'express';
import { injector } from '../../../Injector';
import {authenticationMiddleware, checkDoctorMiddleware, checkIDMiddleware} from '../../helpers/middleware';

const router = express();
const doctorController = injector.getDoctorController;

router.put('/api/doctors/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await doctorController.updateMyProfile(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/api/doctors/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await doctorController.getMyProfile(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/api/doctors', (req, res, next) => {
  checkDoctorMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.createDoctor(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/api/doctors/:id', (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.deleteDoctor(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.put('/api/doctors/:id', (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/api/doctors', async (req, res) => {
  const result = await doctorController.getDoctors(req.query.specializationID);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
