import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create a redis client instance
    this.client = createClient();

    // Handle connection errors
    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    // Connect the client
    this.connected = false;
    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => {
        console.error('Failed to connect to Redis:', err);
      });
  }

  /**
   * Check if the connection to Redis is alive.
   * @returns {boolean} true if the client is connected, else false
   */
  isAlive() {
    return this.connected && this.client.isOpen;
  }

  /**
   * Get the value of a key from Redis.
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} The value associated with the key, or null if none
   */
  async get(key) {
    if (!this.isAlive()) return null;
    const value = await this.client.get(key);
    return value;
  }

  /**
   * Set a key with a given value and expiration (in seconds).
   * @param {string} key - The key to set
   * @param {string|number} value - The value to store
   * @param {number} duration - Expiration time in seconds
   */
  async set(key, value, duration) {
    if (!this.isAlive()) return;
    await this.client.set(key, value, { EX: duration });
  }

  /**
   * Delete a key from Redis.
   * @param {string} key - The key to delete
   */
  async del(key) {
    if (!this.isAlive()) return;
    await this.client.del(key);
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
