import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './tableList.scss';

// MUI components
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axiosInstance from '../../axiosConfig';

function TableListIncidentTypes() {
  const [data, setData] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const token = localStorage.getItem('token');

    axiosInstance
      .get('/api/admin/all-incident', {
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

  const handleView = (incident) => {
    setSelectedIncident(incident);
  };

  const handleDeleteClick = (incident) => {
    setSelectedIncident(incident);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    axiosInstance
      .delete(`/api/admin/deleteincident/${selectedIncident.typeId}`)
      .then((response) => {
        setData(data.filter(item => item.typeId !== selectedIncident.typeId));
        setOpen(false);
        setSelectedIncident(null);
      })
      .catch((error) => {
        console.error('There was an error deleting the incident!', error);
      });
  };

  const handleDeleteCancel = () => {
    setOpen(false);
    setSelectedIncident(null);
  };

  const handleUpdate = () => {
    navigate(`/update-incident/${selectedIncident.typeId}`);
  };

  return (
    <div className="table_container">
      <h2 className="table_title">All Incident Types</h2>
      <TableContainer component={Paper} className="MuiTableContainer-root">
        <Table className="MuiTable-root" aria-label="simple table">
          <TableHead className="MuiTableHead-root">
            <TableRow>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Nom Incident</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Photo</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Description</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Services Responsable</TableCell>
              <TableCell className="MuiTableCell-root MuiTableCell-head">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((incidentType) => (
              <React.Fragment key={incidentType.typeId}>
                <TableRow className="MuiTableRow-root">
                  <TableCell className="MuiTableCell-root MuiTableCell-body">{incidentType.nomincident}</TableCell>
                  <TableCell className="MuiTableCell-root MuiTableCell-body">
                    <img src={incidentType.photoIncidentType} alt={incidentType.nomincident} className="incident-img" onError={(e) => e.target.src = 'default-image-path'} />
                  </TableCell>
                  <TableCell className="MuiTableCell-root MuiTableCell-body">{incidentType.description}</TableCell>
                  <TableCell className="MuiTableCell-root MuiTableCell-body">{incidentType.typeServices.join(', ')}</TableCell>
                  <TableCell className="MuiTableCell-root MuiTableCell-body">
                    <Button variant="contained" color="primary" onClick={() => handleView(incidentType)}>View</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(incidentType)}>Delete</Button>
                  </TableCell>
                </TableRow>
                {selectedIncident && selectedIncident.typeId === incidentType.typeId && (
                  <TableRow className="MuiTableRow-root">
                    <TableCell colSpan={5} className="MuiTableCell-root MuiTableCell-body view_section">
                      <h3>Details de l'incident : {selectedIncident.nomincident}</h3>
                      <p><strong>Description:</strong> {selectedIncident.description}</p>
                      <p><strong>Services Responsable:</strong> {selectedIncident.typeServices.join(', ')}</p>
                      <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                      <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(selectedIncident)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the incident "{selectedIncident?.nomincident}" with type services "{selectedIncident?.typeServices.join(', ')}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TableListIncidentTypes;
