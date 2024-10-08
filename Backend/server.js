import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import syncDatabase from './src/storage/synchronizeDb.js';
import courseCreationRouter from './src/routes/courseCreationRouters.js';
import cartRouter from './src/routes/cartRoute.js';
import authRouter from './src/routes/authRoutes.js';
import courseReviewRouter from './src/routes/courseReview.js';
import learnerRouter from './src/routes/learnerRoutes.js';
import frontendRouter from './src/routes/frontendRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to disable caching completely
app.use((req, res, next) => {
    // Disable caching by setting Cache-Control to 'no-store'
    res.setHeader('Cache-Control', 'no-store');
    next();
});


app.use(express.static(path.join(__dirname, '../Frontend/public')));
app.use('/courses', express.static(path.join(__dirname, 'courses')));


// Body parsing middleware
app.use(express.json());

// Define your routers
app.use(courseCreationRouter);
app.use(cartRouter);
app.use(authRouter);
app.use(courseReviewRouter);
app.use(learnerRouter);
app.use(frontendRouter);

// Start the server
const startServer = async () => {
    try {
        await syncDatabase(); // Synchronize the database before starting the server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

// Execute the server start
startServer();

export default app;
