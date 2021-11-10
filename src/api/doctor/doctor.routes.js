import express from 'express';
import { upload } from '../helpers/fileUpload';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  photoMiddleware,
} from '../helpers/middleware';
import { getArrayFromFormMiddleware } from '../helpers/middleware/getArrayFromFormMiddleware';
import {ROUTES} from "../../constants";
import ajvValidator from "../helpers/middleware/ajvValidator";
import {ChangeDoctorSchema} from "../helpers/schemas/ChangeDoctorSchema";
import {IDSchema} from "../helpers/schemas/IDSchema";
import {PaginationSchema} from "../helpers/schemas/PaginationSchema";

const router = express();
const doctorController = injector.getDoctorController;

router.patch(`${ROUTES.DOCTORS}/me`, upload.single('avatar'), async (req, res, next) => {
  try {
    getArrayFromFormMiddleware(req);
    await authenticationMiddleware(req, res);
    photoMiddleware(req, res);
    ajvValidator(req.body, ChangeDoctorSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.DOCTORS}/me`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    next();
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await doctorController.getMyProfile(req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.DOCTORS}/specialization/:id`, async (req, res, next) => {
  try {
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await doctorController.getDoctorsBySpecializations(req.params.id, req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

router.post(`${ROUTES.ADMIN}/doctors`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.body, ChangeDoctorSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await doctorController.createDoctor(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete(`${ROUTES.ADMIN}/doctors/:id`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await doctorController.deleteDoctor(req.params.id);
  res.status(result.getStatus).json(result.getValue);
});

router.patch(`${ROUTES.ADMIN}/doctors/:id`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await doctorController.updateDoctor(req.params.id, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get(`${ROUTES.ADMIN}/doctors`, async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
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
