import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const MyComponent: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    axiosInstance.get('/devoluciones')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}
    </div>
  );
};

export default MyComponent;