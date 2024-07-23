import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig'; // Asegúrate de que la ruta sea correcta
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function PedidosSummary() {
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
        setRows(response.data);
      } catch (error) {
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
          {rows.slice(0, 5).map((row) => (
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
    </React.Fragment>
  );
}