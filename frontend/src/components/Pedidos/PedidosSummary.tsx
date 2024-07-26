import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

export default function PedidosSummary({ rows, onDelete }) {
  if (!rows || !Array.isArray(rows)) {
    console.error('Los datos de los pedidos son inválidos:', rows);
    return <div>Error: Datos de los pedidos inválidos</div>;
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'entregado':
        return '#228B22'; // Verde oscuro
      case 'pendiente':
        return '#FFD700'; // Amarillo oscuro
      case 'sin entregar':
        return '#B22222'; // Rojo oscuro
      default:
        return '#000000'; // Negro por defecto
    }
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Tipo Pedido</TableCell>
          <TableCell>Fecha Pedido</TableCell>
          <TableCell>Fecha Entrega</TableCell>
          <TableCell>Comentarios</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.ID_Pedido}>
            <TableCell>{row.Tipo_Pedido}</TableCell>
            <TableCell>{new Date(row.Fecha_Pedido).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(row.Fecha_Entrega).toLocaleDateString()}</TableCell>
            <TableCell>{row.Comentarios}</TableCell>
            <TableCell style={{ color: getEstadoColor(row.Estado) }}>{row.Estado}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => onDelete(row.ID_Pedido)}
              >
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
