import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/auth/user.entity';
import { Service } from './src/services/service.entity';
import { Booking } from './src/bookings/booking.entity';

config();

export default new DataSource({
  type: 'better-sqlite3',
  database: process.env.DB_NAME ?? 'database.sqlite',
  entities: [User, Service, Booking],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
