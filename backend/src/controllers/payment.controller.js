import razorpay from '../config/razorpay.js';
import crypto from 'crypto';

// POST : /api/create-razorpay-order
const createRazorpayOrder = async (req, res) => {
    const { amount } = req.body; // Amount in rupees
    try {
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `order_rcptid_${Date.now()}`,
        };
        razorpay.orders.create(options, (err, order) => {
            if (err) {
                console.error('Razorpay Order Creation Error:', err);
                return res.status(500).json({ error: 'Failed to create Razorpay order' });
            }
            // res.json(order);   // use this or below 
            res.json({ ...order, key: process.env.RAZORPAY_KEY_ID }); // Send key in the response
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: 'Failed to create order.' });
    }
}

// POST : /api/verify-razorpay-payment
const verifyRazorpayPayment = (req, res) => {
        try {
        // const { order_id, payment_id, signature } = req.body;
        const { order_id, payment_id, signature, addressId, userId, cartItems, totalAmount } = req.body;
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                        .update(order_id + "|" + payment_id)
                                        .digest('hex');
        if (generated_signature === signature) {
            res.json({ success: true, message: 'Payment signature verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
}

export { 
    createRazorpayOrder, 
    verifyRazorpayPayment 
};