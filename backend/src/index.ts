import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import personaRoutes from './routes/personaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import clienteRoutes from './routes/clienteRoutes';
import { AppDataSource } from './config/data-source';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', personaRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', clienteRoutes);

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
