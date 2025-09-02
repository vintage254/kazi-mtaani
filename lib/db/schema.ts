import { pgTable, serial, text, timestamp, integer, boolean, decimal, pgEnum, foreignKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const userRoleEnum = pgEnum('user_role', ['worker', 'supervisor', 'admin'])
export const groupStatusEnum = pgEnum('group_status', ['active', 'inactive', 'suspended'])
export const attendanceStatusEnum = pgEnum('attendance_status', ['present', 'absent', 'late'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'approved', 'disbursed', 'failed'])
export const attendanceMethodEnum = pgEnum('attendance_method', ['qr_code', 'fingerprint', 'both'])

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').unique(),
  username: text('username').unique().notNull(),
  email: text('email').unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  profileImage: text('profile_image'),
  role: userRoleEnum('role').default('worker'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Groups table
export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  supervisorId: integer('supervisor_id').references(() => users.id),
  status: groupStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Workers table (extends user info for workers)
export const workers = pgTable('workers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  groupId: integer('group_id').references(() => groups.id),
  position: text('position').default('worker'),
  dailyRate: decimal('daily_rate', { precision: 10, scale: 2 }),
  joinedAt: timestamp('joined_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  preferredAttendanceMethod: attendanceMethodEnum('preferred_attendance_method').default('qr_code'),
  fingerprintEnabled: boolean('fingerprint_enabled').default(false),
})

// Attendance table
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  workerId: integer('worker_id').references(() => workers.id),
  groupId: integer('group_id').references(() => groups.id),
  date: text('date'), // YYYY-MM-DD format
  checkInTime: timestamp('check_in_time'),
  checkOutTime: timestamp('check_out_time'),
  status: attendanceStatusEnum('status').default('present'),
  location: text('location'),
  scannerId: text('scanner_id'), // ID of the scanner machine used
  faceRecognitionScore: decimal('face_recognition_score', { precision: 5, scale: 2 }),
  supervisorApproved: boolean('supervisor_approved').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  attendanceMethod: attendanceMethodEnum('attendance_method').default('qr_code'),
  fingerprintMatchScore: decimal('fingerprint_match_score', { precision: 5, scale: 2 }),
})

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  workerId: integer('worker_id').references(() => workers.id),
  groupId: integer('group_id').references(() => groups.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  period: text('period'), // e.g., "2024-08-26" for daily, "2024-08-W34" for weekly
  status: paymentStatusEnum('status').default('pending'),
  approvedBy: integer('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  mpesaTransactionId: text('mpesa_transaction_id'),
  disbursedAt: timestamp('disbursed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Alerts table
export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'face_recognition_failed', 'low_attendance', 'payment_pending'
  title: text('title').notNull(),
  description: text('description'),
  severity: text('severity').default('medium'), // 'low', 'medium', 'high', 'critical'
  workerId: integer('worker_id').references(() => workers.id),
  groupId: integer('group_id').references(() => groups.id),
  isRead: boolean('is_read').default(false),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Reports table
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(), // 'attendance', 'payment', 'group_summary'
  generatedBy: integer('generated_by').references(() => users.id),
  groupId: integer('group_id').references(() => groups.id),
  period: text('period'),
  filePath: text('file_path'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Face embeddings for recognition
export const faceEmbeddings = pgTable('face_embeddings', {
  id: serial('id').primaryKey(),
  workerId: integer('worker_id').references(() => workers.id),
  embedding: text('embedding'), // JSON string of face embedding vector
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Authenticators table for WebAuthn
export const authenticators = pgTable('authenticators', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  credentialID: text('credential_id').unique().notNull(),
  publicKey: text('public_key').notNull(),
  counter: integer('counter').notNull(),
  transports: text('transports'), // Comma-separated list
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
	worker: one(workers, {
		fields: [users.id],
		references: [workers.userId]
	}),
	authenticators: many(authenticators),
}));

export const authenticatorsRelations = relations(authenticators, ({ one }) => ({
  user: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}));
