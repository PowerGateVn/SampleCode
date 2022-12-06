import express from 'express';
import { decorator as usersDecorator } from './users';

const router = express.Router();

router.get('/health-check', (req, res) => {
  res.send('OK');
});

usersDecorator(router);

export default router;
