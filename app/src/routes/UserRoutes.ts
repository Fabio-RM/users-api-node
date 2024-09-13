import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import upload from '../middlewares/multer';

const router = Router();

router.post('/users/create', upload.single('avatar'), UserController.create);
router.post('/users/login', UserController.login);
router.post('/users/logout', UserController.logout);
router.post('/users/refresh-token', UserController.refreshToken);
router.get('/users/verify-token', authenticateJWT, UserController.verifyToken);

export default router;