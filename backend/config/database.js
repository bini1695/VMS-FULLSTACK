import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Read .env BEFORE accessing process.env properties
dotenv.config();

// Create a connection pool to manage MySQL database queries efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vetracare_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
});

// Test and verify connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Successfully connected to MySQL database: ${process.env.DB_NAME || 'vetracare_db'}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();

export default pool;