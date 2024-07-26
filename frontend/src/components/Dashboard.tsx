import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PedidosSummary from './Pedidos/PedidosSummary';
import Chart from './Ejemplos/Chart';
import Deposits from './Ejemplos/Deposits';
import { getPedidos, deletePedido } from '../services/pedidoService.ts';

const Dashboard = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        setRows(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const handleDeletePedido = async (id) => {
    try {
      await deletePedido(id);
      setRows((prevRows) => prevRows.filter((row) => row.ID_Pedido !== id));
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Recent Pedidos */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <PedidosSummary rows={rows} onDelete={handleDeletePedido} />
        </Paper>
      </Grid>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Chart />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      {/* <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Deposits />
        </Paper>
      </Grid> */}
    </Grid>
  );
};

export default Dashboard;
