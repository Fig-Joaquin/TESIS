import axios from '../axiosConfig';

const getPedidos = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('/pedidos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const addPedido = async (pedido) => {
  const token = localStorage.getItem('token');
  console.log('Enviando pedido:', JSON.stringify(pedido, null, 2));
  
  try {
    const response = await axios.post('/crear-pedido', pedido, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar el pedido:', error);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    throw error;
  }
};

const deletePedido = async (id) => {
  const token = localStorage.getItem('token');
  await axios.delete(`/eliminar-pedido/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getPedidos, addPedido, deletePedido };
