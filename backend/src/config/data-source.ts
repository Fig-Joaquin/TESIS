import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // Cambia a false en producción y usa migraciones
  logging: false,
  entities: [__dirname + '/../entity/*.ts'],
  migrations: [__dirname + '/../migration/*.ts'],
  subscribers: [__dirname + '/../subscriber/*.ts'],
});
