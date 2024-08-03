import React, { useEffect, useState } from 'react';
import './tableList.scss';

// mui table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axiosInstance from '../../axiosConfig';

function TableListUrgentistes() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const serviceId = localStorage.getItem('serviceId');
    const token = localStorage.getItem('token');

    console.log('Service ID:', serviceId);
    if (!storedRole || !token) {
        console.error('Missing required information in local storage');
        setError('Missing required information in local storage');
        return;
    }

    setRole(storedRole);

    const fetchUrl = storedRole === 'ADMIN' 
        ? '/api/admin/all-urgentistes' 
        : `/api/serviceAdmin/urgentistesbyserviceId?serviceId=${serviceId}`;

    console.log(`Fetching data from ${fetchUrl} with token ${token}`); // Debug

    axiosInstance
        .get(fetchUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log('Data fetched successfully', response.data); // Debug
            setData(response.data);
        })
        .catch((error) => {
            console.error('There was an error fetching the data!', error);
            setError('There was an error fetching the data!');
        });
}, []);

if (error) {
    return <div>{error}</div>;
}
  return (
    <div className="table_container">
      <h2 className="table_title">All Urgentistes</h2>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nom Complet</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              {role === 'ADMIN' && <TableCell>Nom du Service</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((urgentist) => (
              <TableRow key={urgentist.id}>
                <TableCell>{urgentist.nomComplet}</TableCell>
                <TableCell>{urgentist.email}</TableCell>
                <TableCell>{urgentist.tel}</TableCell>
                {role === 'ADMIN' && <TableCell>{urgentist.nomServices}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TableListUrgentistes;
