import express from 'express';
import syncDatabase from './src/storage/sychronizeDb';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Skillup!');
});

// Start your server after syncing the database
const startServer = async () => {
  try {
    await syncDatabase(); // Sync the database
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
