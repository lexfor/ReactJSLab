import express from 'express';

import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  checkIDMiddleware,
  paginationMiddleware,
  createResolutionMiddleware,
} from '../helpers/middleware';
import { SORT_TYPE, SORTS } from '../../constants';

const router = express();
const resolutionController = injector.getResolutionController;

router.post('/', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  createResolutionMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.createResolution(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.delete('/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.deleteResolution(req.params.id, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.updateResolution(req.params.id, req.body, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.getResolutions({
    patientID: req.userID,
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    sort: SORTS[req.query.sort],
    variant: SORT_TYPE[req.query.variant],
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/doctor/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.getMyResolutions({
    doctorID: req.userID,
    date: req.query.date,
    offset: req.query.offset,
    count: req.query.count,
    name: req.query.name,
    sort: SORTS[req.query.sort],
    variant: SORT_TYPE[req.query.variant],
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/doctor/specialization/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.getPatientResolutionsByDoctorSpecializationID({
    patientID: req.userID,
    specializationID: req.params.specializationID,
    name: req.query.name,
    offset: req.query.offset,
    count: req.query.count,
    sort: SORTS[req.query.sort],
    variant: SORT_TYPE[req.query.variant],
  });
  res.status(result.getStatus).json(result.getValue);
});

router.get('/date', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  paginationMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.getPatientResolutionsByDate({
    patientID: req.userID,
    date: req.query.date,
    name: req.query.name,
    offset: req.query.offset,
    count: req.query.count,
    sort: SORTS[req.query.sort],
    variant: SORT_TYPE[req.query.variant],
  });
  res.status(result.getStatus).json(result.getValue);
});

export default router;
