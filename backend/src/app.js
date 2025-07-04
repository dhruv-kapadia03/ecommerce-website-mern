import express from 'express';
import cors from 'cors';
import upload from './middlewares/uploadMiddleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ credentials: true }));
app.use('/images', express.static('upload/images'));  // Serve static images


// API Routes
app.post('/api/upload', upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded." });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});


// All Routes
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js';
import productRouter from './routes/product.routes.js';
import paymentRouter from './routes/payment.routes.js';
import promocodeRouter from './routes/promocode.routes.js';

// Routes declaration
app.use('/api', userRouter);
app.use('/api', adminRouter);
app.use('/api', productRouter);
app.use('/api', paymentRouter);
app.use('/api', promocodeRouter);

export default app;