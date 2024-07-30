import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/users/create', UserController.create);
router.post('/users/login', UserController.login);

export default router;