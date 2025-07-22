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
   * @param input - The user input (email, password, role)
   * @param isAdmin - Flag to determine if this is an admin creating a user
   */
  static async createUser(
    input: { email: string; password: string; role?: string },
    isAdmin: boolean = false
  ): Promise<UserRecord> {
    const { email, password, role } = input;

    // If it's an admin user creation, include the role; else, set role to 'user' for public signup
    const userRole = isAdmin ? role : 'user'; // 'user' is the default role for public signup

    const sql = `
    INSERT INTO users (email, password, role)
    VALUES ($1, $2, $3)
    RETURNING id, email, password, role
  `;

    const { rows } = await pool.query(sql, [email, password, userRole]);
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
    offset: number = 0,
    action?: string,
    adminEmail?: string
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
      WHERE 
        ($3::audit_action_type IS NULL OR al.action = $3::audit_action_type)
        AND ($4::text IS NULL OR admin.email = $4::text)
      ORDER BY al.timestamp DESC
      LIMIT $1 OFFSET $2
    `;

    const { rows } = await pool.query(sql, [
      limit,
      offset,
      action ?? null,
      adminEmail ?? null,
    ]);

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

  /**
   * Count the number of audit log entries that match the optional filters.
   *
   * @param action - Optional audit action type filter (enum: PROMOTE_TO_ADMIN, DELETE_USER, etc.)
   * @param adminEmail - Optional admin email to filter audit logs by admin
   * @returns Number of matching audit log entries
   */
  static async getAuditLogCount(
    action?: string,
    adminEmail?: string
  ): Promise<number> {
    let sql = `
    SELECT COUNT(*) FROM audit_log al
    LEFT JOIN users admin ON al.admin_id = admin.id
    WHERE 1=1
  `;
    const values: any[] = [];
    let paramIndex = 1;

    if (action) {
      sql += ` AND al.action = $${paramIndex++}::audit_action_type`;
      values.push(action);
    }

    if (adminEmail) {
      sql += ` AND admin.email = $${paramIndex++}`;
      values.push(adminEmail);
    }

    const { rows } = await pool.query(sql, values);
    return parseInt(rows[0].count, 10);
  }

  /**
   * Fetch all audit logs for CSV export with optional filters.
   * This returns the full dataset (no pagination) based on filter.
   *
   * @param action Optional audit action type to filter
   * @param adminEmail Optional admin email to filter
   * @returns Array of audit log rows with metadata
   */
  static async getAuditLogsForCSV(
    action?: string,
    adminEmail?: string
  ): Promise<
    {
      id: string;
      timestamp: string;
      action: 'PROMOTE_TO_ADMIN' | 'DELETE_USER' | 'DEMOTE_TO_USER';
      details: string | null;
      admin_email: string | null;
      target_email: string | null;
    }[]
  > {
    let sql = `
    SELECT
      al.id,
      al.timestamp,
      al.action,
      al.details,
      admin.email AS admin_email,
      target.email AS target_email
    FROM audit_log al
    LEFT JOIN users admin ON al.admin_id = admin.id
    LEFT JOIN users target ON al.target_id = target.id
    WHERE 1=1
  `;

    const values: any[] = [];
    let paramIndex = 1;

    if (action) {
      sql += ` AND al.action = $${paramIndex++}::audit_action_type`;
      values.push(action);
    }

    if (adminEmail) {
      sql += ` AND admin.email = $${paramIndex++}`;
      values.push(adminEmail);
    }

    sql += ` ORDER BY al.timestamp DESC`;

    const { rows } = await pool.query(sql, values);
    return rows;
  }

  static async getAuditActionCountsPerAdmin(): Promise<
    {
      admin_email: string;
      PROMOTE_TO_ADMIN: number;
      DEMOTE_TO_USER: number;
      DELETE_USER: number;
    }[]
  > {
    const sql = `
    SELECT 
      u.email AS admin_email,
      COUNT(*) FILTER (WHERE al.action = 'PROMOTE_TO_ADMIN') AS "PROMOTE_TO_ADMIN",
      COUNT(*) FILTER (WHERE al.action = 'DEMOTE_TO_USER') AS "DEMOTE_TO_USER",
      COUNT(*) FILTER (WHERE al.action = 'DELETE_USER') AS "DELETE_USER"
    FROM audit_log al
    LEFT JOIN users u ON al.admin_id = u.id
    GROUP BY u.email
    ORDER BY u.email
  `;

    const { rows } = await pool.query(sql);
    return rows;
  }

  /**
   * Get the total count of users from the database.
   * @returns {number} The count of users
   */
  static async getUserCount(): Promise<number> {
    const sql = 'SELECT COUNT(*) FROM users';
    const { rows } = await pool.query(sql);
    console.log('rows:', rows);
    return parseInt(rows[0].count, 10);
  }

  /**
   * Get a list of users with pagination.
   * @param limit - Number of users to fetch
   * @param offset - Number of users to skip
   * @returns {Promise<UserRecord[]>} List of users
   */
  static async getUsers(limit: number, offset: number): Promise<UserRecord[]> {
    const sql = `
      SELECT id, email, role
      FROM users
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(sql, [limit, offset]);
    return rows;
  }
}
