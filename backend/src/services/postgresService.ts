import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configure PostgreSQL connection pool using explicit PG_* env vars
const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: process.env.NODE_ENV === 'production',
});

// Define TypeScript interfaces for clarity
export interface MetricRecord {
  id: string;
  userId: string;
  timestamp: string;
  mood: number;
  energy: number;
  sleepHours: number;
}

export interface UserRecord {
  id: string;
  email: string;
  password: string;
  role: string;
}

/**
 * Service class for Postgres operations
 */
export class PostgresService {
  /**
   * Log a metric into the metrics_log table
   */
  static async logMetric(metric: MetricRecord): Promise<void> {
    const { id, userId, timestamp, mood, energy, sleepHours } = metric;
    const sql = `
      INSERT INTO metrics_log
        (id, user_id, timestamp, mood, energy, sleep_hours)
      VALUES
        ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(sql, [id, userId, timestamp, mood, energy, sleepHours]);
  }

  /**
   * Create a new user record
   */
  static async createUser(input: {
    email: string;
    password: string;
    role: string;
  }): Promise<UserRecord> {
    const { email, password, role } = input;
    const sql = `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, password, role
    `;
    const { rows } = await pool.query(sql, [email, password, role]);
    return rows[0];
  }

  /**
   * Find a user by their email address
   */
  static async findUserByEmail(email: string): Promise<UserRecord | null> {
    const sql = `
      SELECT id, email, password, role
      FROM users
      WHERE email = $1
    `;
    const { rows } = await pool.query(sql, [email]);
    return rows[0] ?? null;
  }
}
