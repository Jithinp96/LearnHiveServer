import { Router } from 'express';
import { StudentController } from '../controllers/StudentController';

const router = Router();

router.post('/register', StudentController.register);

export default router;