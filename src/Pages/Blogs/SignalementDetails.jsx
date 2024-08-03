import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import '../../Pages/Blogs/signalementDetails.scss';

function SignalementDetails() {
  const { id } = useParams();
  const [signalement, setSignalement] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSignalement = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      let url = '';

      if (role === 'ADMIN') {
        url = `/api/admin/incidentSignaler/${id}`;
      } else if (role === 'SERVICE_ADMIN') {
        url = `/api/serviceAdmin/incidentSignaler/${id}`;
      } else {
        setError('Role not recognized');
        return;
      }

      try {
        const response = await axiosInstance.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response && response.data) {
          setSignalement(response.data);
        } else {
          setError('Aucune donnée trouvée pour ce signalement');
        }
      } catch (error) {
        setError('Erreur lors de la récupération des données');
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchSignalement();
  }, [id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!signalement) {
    return <div>Chargement...</div>;
  }

  const { latitude, longitude } = signalement.location;

  return (
    <div className="signalement-details-page">
      <div className="home_sidebar">
          <Sidebar />
      </div>
      <div className="main-content">
        <Navbar />

        <div className="signalement-details">
          <h3 className="title">Détails du Signalement</h3>
          <div className="details">
            <p><strong>ID:</strong> {signalement.id}</p>
            <p><strong>Nom Incident:</strong> {signalement.nomIncident}</p>
            <p><strong>Type de Services:</strong> {signalement.typeServices}</p>
            <p><strong>Signalé Par:</strong> {signalement.signalerPar}</p>
            <p><strong>Date de Signalement:</strong> {new Date(signalement.reportedAt).toLocaleString()}</p>
            <p><strong>Résolu:</strong> {signalement.resolved ? 'Oui' : 'Non'}</p>
            {signalement.resolved && (
              <p><strong>Date de Résolution:</strong> {new Date(signalement.resolvedAt).toLocaleString()}</p>
            )}
            <p><strong>Latitude:</strong> {latitude}</p>
            <p><strong>Longitude:</strong> {longitude}</p>
          </div>
          <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '300px', width: '100%', margin: '20px 0' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[latitude, longitude]}>
              <Popup>Incident Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default SignalementDetails;
