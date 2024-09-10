import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient({ url: 'redis://localhost:6379' }); // Adjust URL if needed
    this.connected = false;

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      console.log('Redis client connected');
      this.connected = true;
    });

    this.client.on('end', () => {
      console.log('Redis client disconnected');
      this.connected = false;
    });

    this.connect();
  }

  async connect() {
    if (!this.connected) {
      try {
        await this.client.connect();
      } catch (err) {
        console.error('Error connecting to Redis:', err);
      }
    }
  }


  isAlive() {
    return this.connected;
  }


  async get(key) {
    if (!await this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    return this.client.get(key);
  }

  async set(key, val, dur) {
    if (!await this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    await this.client.set(key, val, {
      EX: dur
    });
  }

  async del(key) {
    if (!await this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    await this.client.del(key);
  }

  async disconnect() {
    if (this.connected) {
      await this.client.quit();
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;
