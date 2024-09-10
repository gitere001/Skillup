import express from 'express';
import syncDatabase from './src/storage/synchronizeDb.js';
import routes from './src/routes/routes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(routes);

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
