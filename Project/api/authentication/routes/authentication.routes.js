import express from 'express';
import { injector } from '../../../Injector';
import {
  authenticationMiddleware,
  checkLoginDataMiddleware,
  checkUserMiddleware,
  refreshTokenMiddleware,
} from '../../helpers/middleware';

const router = express();
const authenticationController = injector.getAuthenticationController;

router.post('/login', async (req, res, next) => {
  checkLoginDataMiddleware(req, res, next);
}, async (req, res) => {
  const result = await authenticationController.login(req.body);
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

router.put('/password', async (req, res, next) => {
  await authenticationMiddleware(req, res);
  next();
}, async (req, res) => {
  const result = await authenticationController.changePassword(req.userID, req.body);
  res.status(result.getStatus).json(result.getValue);
});

export default router;
