import sequelize from '../storage/db.js';
import redisClient from '../storage/redis.js';

const postgresisAlive = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    return false;
  }
}

class AppController {
  static async getStatus(req, res) {
      const status = {
        postgres: await postgresisAlive(),
        redis: redisClient.isAlive(),
      };

      res.status(200).json(status);
    }
}

export default AppController;
