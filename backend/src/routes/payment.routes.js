import { Router } from 'express';

import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-razorpay-payment', verifyRazorpayPayment);

export default router;