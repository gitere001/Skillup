import express from 'express';
import syncDatabase from './src/storage/synchronizeDb.js';
import Router from './src/routes/authRoutes.js';
import router from './src/routes/authRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(router);

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
