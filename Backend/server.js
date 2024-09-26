import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
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


app.use('/images', express.static(path.join(__dirname, '../Frontend/public/images'), {
  maxAge: '1d'
}));
app.use(express.static(path.join(__dirname, '../Frontend/public/')));

console.log(path.join(__dirname, '../Frontend/public'));


app.use(express.json());
app.use(courseCreationRouter);
app.use(cartRouter);
app.use(authRouter);
app.use(courseReviewRouter);
app.use(learnerRouter)
app.use(frontendRouter);



const startServer = async () => {
  try {
    await syncDatabase();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();

export default app;
