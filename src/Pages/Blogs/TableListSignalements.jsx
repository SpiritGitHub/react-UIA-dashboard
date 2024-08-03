import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import '../../Components/TableList/tableList.scss';

const signalementColumns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'nomIncident', headerName: 'Nom Incident', width: 200 },
  { field: 'typeServices', headerName: 'Type de Services', disableColumnFilter: true, width: 200 },
  { field: 'signalerPar', headerName: 'Signalé Par', disableColumnFilter: true, width: 200 },
  {
    field: 'reportedAt',
    headerName: 'Date de Signalement',
    width: 200,
    renderCell: (params) => new Date(params.value).toLocaleString(),
  },
  {
    field: 'resolvedAt',
    headerName: 'Date de Résolution',
    width: 200,
    renderCell: (params) => (
      <span>
        {params.row.resolved ? new Date(params.value).toLocaleString() : '-----    -----'}
      </span>
    ),
  },
  {
    field: 'location',
    headerName: 'Location',
    width: 200,
    renderCell: (params) => (
      <span>{params.value.latitude}, {params.value.longitude}</span>
    ),
  },
  {
    field: 'takeincharge',
    headerName: 'Pris en Charge',
    width: 150,
    renderCell: (params) => (
      <span style={{ color: params.value ? 'green' : 'red' }}>
        {params.value ? 'Oui' : 'Non'}
      </span>
    ),
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 200,
    disableColumnFilter: true,
    renderCell: (params) => {
      const role = localStorage.getItem('role');
      const handleTakeCharge = async () => {
        if (window.confirm('Voulez-vous vraiment prendre en charge cet incident ?')) {
          try {
            const token = localStorage.getItem('token');
            await axiosInstance.put(
              `/api/serviceAdmin/takeCharge/${params.row.id}`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            alert('Incident pris en charge avec succès');
          } catch (error) {
            console.error('Erreur lors de la prise en charge de l\'incident', error);
            alert('Erreur lors de la prise en charge de l\'incident');
          }
        }
      };

      return (
        <div className="actions">
          <Link to={`/signalements/${params.row.id}`}>
            <button type="button" className="view_btn">
              Voir
            </button>
          </Link>
          {role === 'SERVICE_ADMIN' && !params.row.resolved && (
            <button type="button" className="take_charge_btn" onClick={handleTakeCharge}>
              Prendre en charge
            </button>
          )}
        </div>
      );
    },
  },
];

function TableListSignalements() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        let response;
        if (userRole === 'ADMIN') {
          response = await axiosInstance.get('/api/admin/incidentSignaler', {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (userRole === 'SERVICE_ADMIN') {
          const serviceId = localStorage.getItem('serviceId');
          response = await axiosInstance.get(
            `/api/serviceAdmin/signalement/service/${serviceId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }

        if (response && response.data) {
          const dataWithId = response.data.map((item, index) => ({
            id: index + 1,
            ...item,
          }));
          setData(dataWithId);
          setFilteredData(dataWithId);
        } else {
          console.error('Aucune donnée reçue de l\'API');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, []);

  const handleStatusFilterClick = () => {
    let newStatusFilter;
    let newFilteredData;

    if (statusFilter === 'all') {
      newStatusFilter = 'resolved';
      newFilteredData = data.filter((item) => item.resolved);
    } else if (statusFilter === 'resolved') {
      newStatusFilter = 'unresolved';
      newFilteredData = data.filter((item) => !item.resolved);
    } else {
      newStatusFilter = 'all';
      newFilteredData = data;
    }

    setStatusFilter(newStatusFilter);
    setFilteredData(newFilteredData);
    setPage(0); // Reset to first page after filter change
  };

  const statusColor =
    statusFilter === 'all'
      ? 'gray'
      : statusFilter === 'resolved'
      ? 'green'
      : 'red';

  const columns = [
    ...signalementColumns,
    {
      field: 'status',
      headerName: 'Status',
      renderHeader: () => (
        <div
          onClick={handleStatusFilterClick}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={handleStatusFilterClick}
        >
          <span>Status</span>
          <span
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: statusColor,
              borderRadius: '50%',
              marginLeft: '5px',
            }}
          />
        </div>
      ),
      width: 150,
      renderCell: (params) => (
        <span style={{ color: params.row.resolved ? 'green' : 'red' }}>
          {params.row.resolved ? 'Résolu' : 'Non Résolu'}
        </span>
      ),
    },
  ];

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page after page size change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="signalement_page_table" style={{ height: '600px' }}>
      <h3 className="page_title">Liste des Signalements</h3>
      <DataGrid
        rows={filteredData.slice(page * pageSize, (page + 1) * pageSize)}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 15, 20]}
        pagination
        paginationMode="client"
        rowCount={filteredData.length}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        page={page}
      />
      <div className="pagination-info">
        {filteredData.length === 0 && <p>Aucun élément à afficher.</p>}
      </div>
    </div>
  );
}

export default TableListSignalements;
