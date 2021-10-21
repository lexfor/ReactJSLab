import express from 'express';
import { upload } from '../helpers/fileUpload';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  checkDoctorMiddleware,
  checkIDMiddleware,
  photoMiddleware,
  paginationMiddleware,
  checkDoctorDataMiddleware,
} from '../helpers/middleware';
import { getArrayFromFormMiddleware } from '../helpers/middleware/getArrayFromFormMiddleware';

const router = express();
const doctorController = injector.getDoctorController;

router.patch('/me', upload.single('avatar'), async (req, res, next) => {
  await authenticationMiddleware(req, res);
  photoMiddleware(req, res);
  checkDoctorDataMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await doctorController.getMyProfile(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/specialization/:id', async (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.getDoctorsBySpecializations(req.params.id, req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/', (req, res, next) => {
  checkDoctorMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.createDoctor(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/:id', (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.deleteDoctor(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/:id', (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/', async (req, res, next) => {
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.getDoctors({
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

export default router;
