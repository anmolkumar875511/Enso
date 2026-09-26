import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './src/middlewares/errorHandler.js';
import connectDB from './db.js'
import authRoutes from './src/routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running: http://localhost:${PORT}`);
    });
});