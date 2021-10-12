import express from 'express';
import multer from 'multer';
import { injector } from '../../../Injector';
import {
  authenticationMiddleware,
  checkDoctorMiddleware,
  checkIDMiddleware,
  photoMiddleware,
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
const doctorController = injector.getDoctorController;

router.post('/me', upload.single('avatar'), async (req, res, next) => {
  await authenticationMiddleware(req, res);
  photoMiddleware(req, res, next);
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

router.put('/:id', (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/', async (req, res) => {
  const result = await doctorController.getDoctors(req.query.specializationID, req.query.name);
  console.log(result);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
