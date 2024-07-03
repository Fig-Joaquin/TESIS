import dotenv from 'dotenv';
import path from 'path';

// Cargar las variables de entorno con la ruta explícita al archivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { AppDataSource } from './config/data-source'; // Ajusta la ruta según tu estructura de carpetas
import { Cliente } from './entities/clienteEntity';

// Imprimir variables de entorno para depuración
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

async function testGetClienteByRut(rut: string) {
  try {
    // Inicializar la conexión con la base de datos
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');

    // Obtener el repositorio de Cliente
    const clienteRepository = AppDataSource.getRepository(Cliente);

    // Ejecutar la consulta
    const cliente = await clienteRepository.findOne({
      where: { persona: { Rut_Persona: rut.toLowerCase() } },
      relations: ['persona'],
    });

    // Verificar el resultado
    if (!cliente) {
      console.log('Cliente not found');
    } else {
      console.log('Cliente found:', cliente);
    }

    // Cerrar la conexión con la base de datos
    await AppDataSource.destroy();
  } catch (err) {
    console.error('Error:', err);
  }
}

// Reemplaza con un RUT existente en tu base de datos
testGetClienteByRut('12537921-3');
