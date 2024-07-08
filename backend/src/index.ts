import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import personaRoutes from './routes/personaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import clienteRoutes from './routes/clienteRoutes';
import comunaRoutes from './routes/comunaRoutes';
import regionRoutes from './routes/regionRoutes';
import roles from './routes/rolesRoutes';
import rolUsuario from './routes/rolUsuarioRoutes';
import detallePedidoRoutes from './routes/pedidos/detallePedidoRoutes';
import pedidosRoutes from './routes/pedidos/pedidosRoutes';
import proveedorRoutes from './routes/pedidos/proveedorRoutes';
import bodegasRoutes from './routes/productos/bodegasRoutes';
import categoriaRoutes from './routes/productos/categoriaRoutes';
import devolucionesRoutes from './routes/productos/devolucionesRoutes';
import productosRoutes from './routes/productos/productosRoutes';
import registroPreciosRoutes from './routes/productos/registroPreciosRoutes';
import { AppDataSource } from './config/data-source';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', personaRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', clienteRoutes);
app.use('/api', comunaRoutes);
app.use('/api', regionRoutes);
app.use('/api', roles);
app.use('/api', rolUsuario);
app.use('/api', detallePedidoRoutes);
app.use('/api', pedidosRoutes);
app.use('/api', proveedorRoutes);
app.use('/api', bodegasRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', devolucionesRoutes);
app.use('/api', productosRoutes);
app.use('/api', registroPreciosRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => console.log('Error during Data Source initialization:', error));
