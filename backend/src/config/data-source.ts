import { DataSource } from 'typeorm';
import { Usuario } from '../entities/usuarioEntity';
import { Persona } from '../entities/personaEntity';
import { Cliente } from '../entities/clienteEntity';
import { Region } from '../entities/regionEntity';
import { Comuna } from '../entities/comunaEntity';
import { RolUsuario } from '../entities/rolUsuarioEntity';
import { Roles } from '../entities/rolesEntity';

import dotenv from 'dotenv';

dotenv.config();


export const AppDataSource = new DataSource({
  
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'default_username',
  password: process.env.DB_PASSWORD ?? 'default_password',
  database: process.env.DB_NAME ?? 'default_database',
  entities: [Usuario, Persona, Cliente, Region, Comuna, RolUsuario, Roles],
  synchronize: true,
  logging: false,
  migrations: [],
  subscribers: [],
});
