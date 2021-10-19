import express from 'express';
import { upload } from '../helpers/fileUpload';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  checkIDMiddleware,
  checkUserMiddleware,
  photoMiddleware,
  paginationMiddleware,
  checkPatientDataMiddleware,
} from '../helpers/middleware';

const router = express();
const patientController = injector.getPatientController;

router.patch('/me', upload.single('avatar'), async (req, res, next) => {
  await authenticationMiddleware(req, res);
  photoMiddleware(req, res);
  checkPatientDataMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.updatePatient(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await patientController.getMyProfile(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/', async (req, res, next) => {
  checkUserMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.createPatient(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/:id', async (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.deletePatient(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/:id', async (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.updatePatient(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/', async (req, res, next) => {
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.getPatients({
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

export default router;
