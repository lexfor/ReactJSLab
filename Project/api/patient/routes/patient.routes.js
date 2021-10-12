import express from 'express';
import multer from 'multer';
import { injector } from '../../../Injector';
import {
  authenticationMiddleware,
  checkIDMiddleware,
  checkUserMiddleware, photoMiddleware,
} from '../../helpers/middleware';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/Project/api/users/images');
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}${file.originalname}`);
  },
});
const upload = multer({ storage });
const router = express();
const patientController = injector.getPatientController;

router.post('/me', upload.single('avatar'), async (req, res, next) => {
  await authenticationMiddleware(req, res);
  photoMiddleware(req, res, next);
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

router.put('/:id', async (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await patientController.updatePatient(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/', async (req, res) => {
  const result = await patientController.getPatients(req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
