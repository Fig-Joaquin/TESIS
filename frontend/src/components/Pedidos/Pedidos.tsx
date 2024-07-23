import PedidosSummary from './PedidosSummary';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

export default function Pedidos() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <PedidosSummary/> {/* Mostrar todos los pedidos */}
          </Paper>
        </Grid>
      </Grid>
      <Toolbar sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          Agregar Pedido
        </Button>
        <Button variant="contained" color="secondary">
          Filtrar Pedidos
        </Button>
      </Toolbar>
    </Container>
  );
}