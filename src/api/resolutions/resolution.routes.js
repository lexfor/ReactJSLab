import express from 'express';

import { injector } from '../../Injector';
import {
  authenticationMiddleware,
} from '../helpers/middleware';
import ajvValidator from "../helpers/middleware/ajvValidator";
import {CreateResolutionSchema} from "../helpers/schemas/CreateResolutionSchema";
import {IDSchema} from "../helpers/schemas/IDSchema";
import {PaginationSchema} from "../helpers/schemas/PaginationSchema";

const router = express();
const resolutionController = injector.getResolutionController;

router.post('/', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.body, CreateResolutionSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await resolutionController.createResolution(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/:id', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await resolutionController.deleteResolution(req.params.id, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/:id', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.params, IDSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await resolutionController.updateResolution(req.params.id, req.body, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/me', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await resolutionController.getResolutionsForPatient({
    patientID: req.userID,
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/doctor/me', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await resolutionController.getResolutionsForDoctor({
    doctorID: req.userID,
    date: req.query.date,
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/doctor/specialization/:specializationID', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await resolutionController.getPatientResolutionsByDoctorSpecializationID({
    patientID: req.userID,
    specializationID: req.params.specializationID,
    name: req.query.name,
    offset: req.query.offset,
    count: req.query.count,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/date', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    ajvValidator(req.query, PaginationSchema, req, res, next);
  } catch (e) {
    res.status(e.status).json(e.message);
  }
}, async (req, res) => {
  const result = await resolutionController.getPatientResolutionsByDate({
    patientID: req.userID,
    date: req.query.date,
    name: req.query.name,
    offset: req.query.offset,
    count: req.query.count,
    sort: req.query.sort,
    variant: req.query.variant,
  });
  res.status(result.getStatus).json(result.getValue);
});

export default router;
