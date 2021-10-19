import express from 'express';

import { injector } from '../../Injector';

const router = express();
const statusesController = injector.getStatusesController;

router.get('/', async (req, res) => {
  const result = await statusesController.getAllStatuses();
  res.status(result.getStatus).json(result.getValue);
});

export default router;
