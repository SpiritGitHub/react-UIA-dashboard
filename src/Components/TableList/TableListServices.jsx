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

function TableListServices() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axiosInstance
      .get('/api/admin/all-service', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className="table_container">
      <h2 className="table_title">All Services</h2>
      <TableContainer component={Paper} className="MuiTableContainer-root">
        <Table className="MuiTable-root" aria-label="simple table">
          <TableHead className="MuiTableHead-root">
            <TableRow>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Service Name</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Type</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Address</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Admin Name</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Admin Email</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Admin Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((service) => (
              <TableRow className="MuiTableRow-root" key={service.emailAdmin}>
                <TableCell className="MuiTableCell-root MuiTableCell-body">{service.nomService}</TableCell>
                <TableCell className="MuiTableCell-root MuiTableCell-body">{service.typeService}</TableCell>
                <TableCell className="MuiTableCell-root MuiTableCell-body">{service.addresseService}</TableCell>
                <TableCell className="MuiTableCell-root MuiTableCell-body">{service.nomCompletAdmin}</TableCell>
                <TableCell className="MuiTableCell-root MuiTableCell-body">{service.emailAdmin}</TableCell>
                <TableCell className="MuiTableCell-root MuiTableCell-body">{service.telAdmin}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default TableListServices;
