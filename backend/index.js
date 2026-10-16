import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './src/config/passport.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import connectDB from './db.js'
import authRoutes from './src/routes/auth.routes.js';
import documentRoutes from './src/routes/documents.routes.js'

const app = express();
app.use(cors())
app.use(express.json());
app.use(passport.initialize());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running: http://localhost:${PORT}`);
    });
});