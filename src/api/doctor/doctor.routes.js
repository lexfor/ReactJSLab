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
import {ROUTES} from "../../constants";

const router = express();
const doctorController = injector.getDoctorController;

router.patch(`${ROUTES.DOCTORS}/me`, upload.single('avatar'), async (req, res, next) => {
  getArrayFromFormMiddleware(req);
  await authenticationMiddleware(req, res);
  photoMiddleware(req, res);
  checkDoctorDataMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.DOCTORS}/me`, async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await doctorController.getMyProfile(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.DOCTORS}/specialization/:id`, async (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.getDoctorsBySpecializations(req.params.id, req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

router.post(`${ROUTES.ADMIN}/doctors`, (req, res, next) => {
  checkDoctorMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.createDoctor(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete(`${ROUTES.ADMIN}/doctors/:id`, (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.deleteDoctor(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.patch(`${ROUTES.ADMIN}/doctors/:id`, (req, res, next) => {
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.ADMIN}/doctors`, async (req, res, next) => {
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
