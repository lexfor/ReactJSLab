import express from 'express';

import { injector } from '../../Injector';

const router = express();
const specializationsController = injector.getSpecializationsController;

router.get('/', async (req, res) => {
  const result = await specializationsController.getAllSpecializations();
  res.status(result.getStatus).json(result.getValue);
});

export default router;
