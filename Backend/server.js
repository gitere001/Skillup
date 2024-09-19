import express from 'express';
import syncDatabase from './src/storage/synchronizeDb.js';
import courseCreationRouter from './src/routes/courseCreationRouters.js';
import cartRouter from './src/routes/cartRoute.js';
import authRouter from './src/routes/authRoutes.js';
import courseReviewRouter from './src/routes/courseReview.js';
import learnerRouter from './src/routes/learnerRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(courseCreationRouter);
app.use(cartRouter);
app.use(authRouter);
app.use(courseReviewRouter);
app.use(learnerRouter)


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
