import express from 'express';

import { injector } from '../../../Injector';
import {
  authenticationMiddleware,
  checkIDMiddleware,
} from '../../helpers/middleware';

const router = express();
const resolutionController = injector.getResolutionController;

router.post('/', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
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

router.put('/:id', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  checkIDMiddleware(req, res, next);
}, async (req, res) => {
  const result = await resolutionController.updateResolution(req.params.id, req.body, req.userID);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await resolutionController.getResolutions(req.userID, req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/doctor/me', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await resolutionController.getMyResolutions(req.userID, req.query.name);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
