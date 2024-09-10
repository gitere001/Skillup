import express from 'express';
import syncDatabase from './src/storage/sychronizeDb.js';
import userRoutes from './src/routes/authRoutes.js';

const app = express();
app.use(express.json());

app.use('/', userRoutes)


app.get('/', (req, res) => {
  res.send('Hello, Skillup!');
});

// Start your server after syncing the database
const startServer = async () => {
  try {
    await syncDatabase(); 
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
