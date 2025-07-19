import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Initialize a connection pool to your Postgres (local Docker or RDS)
const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

export class PostgresService {
  static async logMetric(metric: {
    id: string;
    userId: string;
    timestamp: string;
    mood: number;
    energy: number;
    sleepHours: number;
  }) {
    const query = `
      INSERT INTO metrics_log (id, user_id, timestamp, mood, energy, sleep_hours)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [
      metric.id,
      metric.userId,
      metric.timestamp,
      metric.mood,
      metric.energy,
      metric.sleepHours,
    ];
    await pool.query(query, values);
  }
}
