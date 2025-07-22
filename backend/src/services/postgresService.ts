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
  }): Promise<UserRecord> {
    const { email, password } = input;
    const sql = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id, email, password, role
    `;
    const { rows } = await pool.query(sql, [email, password]);
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

  /**
   * Log an admin action to the audti_log table
   */
  static async logAuditAction(input: {
    adminId: string;
    action: 'PROMOTE_TO_ADMIN' | 'DELETE_USER' | 'DEMOTE_TO_USER';
    targetId: string;
    details?: string;
  }): Promise<void> {
    const { adminId, action, targetId, details } = input;

    const sql = `
      INSERT INTO audit_log (admin_id, action, target_id, details) VALUES ($1, $2, $3, $4)
    `;
    await pool.query(sql, [adminId, action, targetId, details ?? null]);
  }

  /**
   * Fetch audit log entries with admin and target user emails
   */
  static async getAuditLogs(
    limit: number = 25,
    offset: number = 0
  ): Promise<
    {
      id: string;
      timestamp: string;
      action: 'PROMOTE_TO_ADMIN' | 'DELETE_USER' | 'DEMOTE_TO_USER';
      details: string | null;
      admin_id: string;
      admin_email: string | null;
      target_id: string;
      target_email: string | null;
    }[]
  > {
    const sql = `
    SELECT
      al.id,
      al.timestamp,
      al.action,
      al.details,
      al.admin_id,
      admin.email AS admin_email,
      al.target_id,
      target.email AS target_email
    FROM audit_log al
    LEFT JOIN users admin ON al.admin_id = admin.id
    LEFT JOIN users target ON al.target_id = target.id
    ORDER BY al.timestamp DESC
    LIMIT $1 OFFSET $2
  `;

    const { rows } = await pool.query(sql, [limit, offset]);
    return rows;
  }

  /**
   * Promote a user to admin role by updating their role in the users table.
   * @param userId - UUID of the user to promote
   */
  static async promoteUser(userId: string): Promise<void> {
    const sql = `UPDATE users SET role = 'admin' WHERE id = $1`;
    await pool.query(sql, [userId]);
  }

  /**
   * Demote an admin user back to a regular user role.
   * @param userId - UUID of the user to demote
   */
  static async demoteUser(userId: string): Promise<void> {
    const sql = `UPDATE users SET role = 'user' WHERE id = $1`;
    await pool.query(sql, [userId]);
  }

  /**
   * Delete a user record from the users table.
   * @param userId - UUID of the user to delete
   */
  static async deleteUser(userId: string): Promise<void> {
    const sql = `DELETE FROM users WHERE id = $1`;
    await pool.query(sql, [userId]);
  }

  /**
   * Check if the user is the master admin based on their email.
   * The master admin is protected from deletion or demotion.
   *
   * @param userId - UUID of the user to check
   * @returns boolean - true if master admin, false otherwise
   */
  static async isMasterAdmin(userId: string): Promise<boolean> {
    const sql = `SELECT email FROM users WHERE id = $1`;
    const { rows } = await pool.query(sql, [userId]);
    if (rows.length === 0) return false;
    return rows[0].email === 'admin@auratrack.io';
  }
}
