import { mysqlTable, int, varchar, timestamp, boolean, date } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  trxId: varchar('trx_id', { length: 100 }),
  isApproved: boolean('is_approved').default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const binData = mysqlTable('bin_data', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.id, { onDelete: 'cascade' }),
  binIssueDate: date('bin_issue_date', { mode: 'string' }),
  circle: varchar('circle', { length: 255 }),
  bin: varchar('bin', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }),
  factoryAddress: varchar('factory_address', { length: 1000 }),
  policeStation: varchar('police_station', { length: 255 }),
  mobileNumber: varchar('mobile_number', { length: 100 }),
  email: varchar('email', { length: 255 }),
  registeredHqAddress: varchar('registered_hq_address', { length: 1000 }),
  majorAreaOfEconomicActivity: varchar('major_area_of_economic_activity', { length: 1000 }),
  areasOfManufacturing: varchar('areas_of_manufacturing', { length: 1000 }),
  areasOfService: varchar('areas_of_service', { length: 1000 }),
  forcedRegistration: varchar('forced_registration', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const plans = mysqlTable('plans', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: int('price').notNull(),
  description: varchar('description', { length: 1000 }),
  createdAt: timestamp('created_at').defaultNow(),
});
