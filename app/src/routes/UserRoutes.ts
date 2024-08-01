import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const router = Router();

router.post('/users/create', UserController.create);
router.post('/users/login', UserController.login);
router.get('/users/verify-token', authenticateJWT, UserController.verifyToken);

export default router;