import sequelize from '../storage/db.js';
import redisClient from '../storage/redis.js';

/**
 * Checks if the Postgres database connection is alive.
 * @returns {Promise<boolean>} A boolean indicating whether the connection is alive.
 */
const postgresisAlive = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

class AppController {
  /**
   * Returns the status of the application, including the status of the Postgres database and Redis.
   * @param {Object} req - The request object containing headers.
   * @param {Object} res - The response object.
   * @returns {Object} - JSON response with the status of the application.
   */
  static async getStatus(req, res) {
      const status = {
        postgres: await postgresisAlive(),
        redis: redisClient.isAlive(),
      };

      res.status(200).json(status);
    }
}

export default AppController;
