import { Router } from 'express';

import { adminSignup, adminLogin } from '../controllers/admin.controller.js';

const router = Router();

router.post('/admin/signup', adminSignup);
router.post('/admin/login', adminLogin);

export default router;