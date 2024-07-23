import { useState, useEffect } from 'react';
import { getPedidos, addPedido, deletePedido } from '../../services/pedidoService';
import PedidosSummary from './PedidosSummary';
import AddPedidoForm from './AddPedidoForm.tsx';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';

export default function Pedidos() {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getPedidos();
        setRows(data);
        setFilteredRows(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const handleAddPedido = async (newPedido) => {
    try {
      const addedPedido = await addPedido(newPedido);
      setRows((prevRows) => [...prevRows, addedPedido]);
      setFilteredRows((prevRows) => [...prevRows, addedPedido]);
    } catch (error) {
      console.error('Error al agregar el pedido:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      }
    }
  };

  const handleDeletePedido = async (id) => {
    try {
      await deletePedido(id);
      setRows((prevRows) => prevRows.filter((row) => row.ID_Pedido !== id));
      setFilteredRows((prevRows) => prevRows.filter((row) => row.ID_Pedido !== id));
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    const filtered = rows.filter((row) =>
      row.ID_Pedido.toString().includes(searchValue)
    );
    setFilteredRows(filtered);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toolbar sx={{ mb: 2 }}>
        <TextField
          label="Buscar por ID"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Agregar Pedido
        </Button>
      </Toolbar>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <PedidosSummary rows={filteredRows} onDelete={handleDeletePedido} />
          </Paper>
        </Grid>
      </Grid>
      <AddPedidoForm
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAddPedido}
      />
    </Container>
  );
}
