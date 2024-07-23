import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const Devoluciones = () => {
  const [devoluciones, setDevoluciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevoluciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/devoluciones', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevoluciones(response.data);
      } catch (error) {
        console.error('Error fetching devoluciones:', error);
      }
    };

    fetchDevoluciones();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div>
      <h1>Devoluciones</h1>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {devoluciones.map((devolucion) => (
          <li key={devolucion.ID_Devolucion}>
            {devolucion.Razon} - {devolucion.Cantidad_Unidades} unidades
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Devoluciones;