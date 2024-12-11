import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Retrieve connection parameters from environment variables or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${host}:${port}`;
    this.dbName = database;
    this.connected = false;

    // Initiate the connection
    this.connect();
  }

  /**
   * Connects to the MongoDB database.
   */
  async connect() {
    try {
      // Create a new MongoClient instance
      this.client = new MongoClient(this.url, { useUnifiedTopology: true });
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.connected = true;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  /**
   * Checks if the connection to MongoDB is alive.
   * @returns {boolean} true if connected, otherwise false
   */
  isAlive() {
    return this.connected;
  }

  /**
   * Returns the number of documents in the "users" collection.
   * @returns {Promise<number>} The number of users
   */
  async nbUsers() {
    if (!this.isAlive()) return 0;
    const usersCount = await this.db.collection('users').countDocuments();
    return usersCount;
  }

  /**
   * Returns the number of documents in the "files" collection.
   * @returns {Promise<number>} The number of files
   */
  async nbFiles() {
    if (!this.isAlive()) return 0;
    const filesCount = await this.db.collection('files').countDocuments();
    return filesCount;
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
