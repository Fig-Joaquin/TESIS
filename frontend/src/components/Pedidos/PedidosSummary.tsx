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

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>ID Cliente</TableCell>
          <TableCell>ID Proveedor</TableCell>
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
            <TableCell>{row.ID_Cliente}</TableCell>
            <TableCell>{row.ID_Proveedor}</TableCell>
            <TableCell>{row.Tipo_Pedido}</TableCell>
            <TableCell>{new Date(row.Fecha_Pedido).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(row.Fecha_Entrega).toLocaleDateString()}</TableCell>
            <TableCell>{row.Comentarios}</TableCell>
            <TableCell>{row.Estado}</TableCell>
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
