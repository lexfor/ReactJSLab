import express from 'express';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  tokenMiddleware,
} from '../helpers/middleware';
import {ajvValidator} from '../helpers/middleware/index';
import { LogingSchema } from '../helpers/schemas/LogingSchema';
import { UserSchema } from '../helpers/schemas/UserSchema';

const router = express();
const authenticationController = injector.getAuthenticationController;

router.post('/login', async (req, res, next) => {
  try {
    ajvValidator(req.body, LogingSchema, req, res, next);
  } catch (e) {
    res.status(e.getStatus).json(e.getValue);
  }
}, async (req, res) => {
  const result = await authenticationController.login(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/registration', async (req, res, next) => {
  try {
    ajvValidator(req.body, UserSchema, req, res, next);
  } catch (e) {
    res.status(e.getValue).json(e.getStatus);
  }
}, async (req, res) => {
  const result = await authenticationController.register(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/token/refresh', async (req, res, next) => {
  try {
    tokenMiddleware(req, res, next);
  } catch (e) {
    res.status(e.getValue).json(e.getStatus);
  }
}, async (req, res) => {
  const result = await authenticationController.refreshToken(req.token);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/password', async (req, res, next) => {
  try {
    await authenticationMiddleware(req, res);
    next();
  } catch (e) {
    res.status(e.getValue).json(e.getStatus);
  }
}, async (req, res) => {
  const result = await authenticationController.changePassword(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.get('/profile', async (req, res, next) => {
  try {
    await tokenMiddleware(req, res, next);
  } catch (e) {
    res.status(e.getValue).json(e.getStatus);
  }
}, async (req, res) => {
  const result = await authenticationController.checkToken(req.token);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
