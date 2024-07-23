import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from '../axiosConfig.ts'; // Asegúrate de que la ruta sea correcta
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title.tsx';

export default function Pedidos() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/pedidos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Datos recibidos:', response.data); // Log para verificar los datos recibidos
        setRows(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error); // Log para errores
        setError(error);
      }
    };

    fetchPedidos();
  }, []);

  if (error) {
    return <div>Error al cargar los pedidos.</div>;
  }

  return (
    <React.Fragment>
      <Title>Pedidos recientes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tipo Pedido</TableCell>
            <TableCell>Fecha Pedido</TableCell>
            <TableCell>Fecha Entrega</TableCell>
            <TableCell>Comentarios</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.ID_Pedido}>
              <TableCell>{row.Tipo_Pedido}</TableCell>
              <TableCell>{new Date(row.Fecha_Pedido).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(row.Fecha_Entrega).toLocaleDateString()}</TableCell>
              <TableCell>{row.Comentarios}</TableCell>
              <TableCell>{row.Estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={(event) => event.preventDefault()} sx={{ mt: 3 }}>
        Ver más Pedidos
      </Link>
    </React.Fragment>
  );
}