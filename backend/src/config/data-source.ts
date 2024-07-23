import { DataSource } from 'typeorm';
import { Usuario } from '../entities/usuarioEntity';
import { Persona } from '../entities/personaEntity';
import { Cliente } from '../entities/clienteEntity';
import { Region } from '../entities/regionEntity';
import { Comuna } from '../entities/comunaEntity';
import { RolUsuario } from '../entities/rolUsuarioEntity';
import { Roles } from '../entities/rolesEntity';
import { Productos } from '../entities/productos/productosEntity';
import { Bodegas } from '../entities/productos/bodegasEntity';
import { Categoria } from '../entities/productos/categoriaEntity';
import { Proveedor } from '../entities/pedidos/proveedorEntity';
import { Detalle_Pedido } from '../entities/pedidos/detallePedidoEntity';
import { Registro_Precios } from '../entities/productos/registroPreciosEntity';
import { Devoluciones } from '../entities/productos/devolucionesEntity';
import { Pedidos } from '../entities/pedidos/pedidosEntity';
import { Transaccion } from '../entities/transaccionEntity';
import { Sueldo } from '../entities/sueldoEntity';
import { Gasto } from '../entities/gastoEntity';
import { CategoriaGasto } from '../entities/categoriaGastoEntity';

import dotenv from 'dotenv';

dotenv.config();


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'default_username',
  password: process.env.DB_PASSWORD ?? 'default_password',
  database: process.env.DB_DATABASE ?? 'default_database',
  entities: [Usuario, Persona, Cliente, Region, Comuna, RolUsuario, 
    Roles, Productos, Bodegas, Categoria, Proveedor, Detalle_Pedido, 
    Registro_Precios, Devoluciones, Pedidos, Transaccion, Sueldo, Gasto,
    CategoriaGasto],
  synchronize: true,
  logging: false,
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
