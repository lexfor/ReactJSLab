import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { injector } from '../../Injector';
import {
  authenticationMiddleware,
  checkLoginDataMiddleware,
  checkUserMiddleware,
  refreshTokenMiddleware,
} from '../helpers/middleware';

const router = express();
const authenticationController = injector.getAuthenticationController;

router.post('/login', async (req, res, next) => {
  checkLoginDataMiddleware(req, res, next);
}, async (req, res) => {
  const result = await authenticationController.login(req.body, req.query.role);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/registration', async (req, res, next) => {
  checkUserMiddleware(req, res, next);
}, async (req, res) => {
  const result = await authenticationController.register(req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/token', async (req, res, next) => {
  refreshTokenMiddleware(req, res, next);
}, async (req, res) => {
  const result = await authenticationController.refreshToken(req.token);
  res.status(result.getStatus).json(result.getValue);
});

router.patch('/password', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await authenticationController.changePassword(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

router.post('/check', async (req, res) => {
  await authenticationMiddleware(req, res);
  res.status(StatusCodes.OK).json('');
});

export default router;
