// controllers/dbController.js
import sequelize from '../storage/db.js'; // Import your Sequelize instance

// Function to check database connection
const checkDatabaseConnection = async (req, res) => {
  try {
    // Try to authenticate the connection to the PostgreSQL database
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');

    // If connected, return true
    return res.status(200).json({
      success: true,
      message: 'Database is connected',
      connected: true
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);

    // If an error occurs, return false
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      connected: false
    });
  }
};

export default checkDatabaseConnection;
