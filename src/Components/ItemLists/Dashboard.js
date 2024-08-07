import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig'; // Importez votre instance Axios configurée
import ItemLists from './ItemLists';

function Dashboard() {
    const [data, setData] = useState({
        services: 0,
        signalement: 0,
        urgentistes: 0,
        incidents: 0,
    });
    const [role, setRole] = useState(null);
    const [serviceId, setServiceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Récupérer le rôle et le serviceId depuis le localStorage
        const userRole = localStorage.getItem('role');
        const userServiceId = localStorage.getItem('serviceId');
        setRole(userRole);
        setServiceId(userServiceId);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl;
                if (role === 'ADMIN') {
                    apiUrl = 'api/admin/models/counts';
                } else if (role === 'SERVICE_ADMIN' && serviceId) {
                    apiUrl = `api/serviceAdmin/counts/${serviceId}`;
                }

                if (apiUrl) {
                    const response = await axiosInstance.get(apiUrl);
                    const data = response.data;
                    if (role === 'ADMIN') {
                        setData({
                            services: data.numberOfServices,
                            signalement: data.numberOfReportedIncident,
                            urgentistes: data.numberOfUrgentistes,
                            incidents: data.numberOfIncidents,
                        });
                    } else if (role === 'SERVICE_ADMIN') {
                        setData({
                            signalement: data.numberOfReportedIncident,
                            urgentistes: data.numberOfUrgentistes,
                        });
                    }
                }
            } catch (error) {
                setError('Erreur lors de la récupération des données');
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };

        if (role !== null) {
            fetchData();
        }
    }, [role, serviceId]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard">
            {role === 'ADMIN' && <ItemLists title="SERVICES" count={data.services} />}
            <ItemLists title="SIGNALEMENT" count={data.signalement} />
            <ItemLists title="URGENTISTES" count={data.urgentistes} />
            {role === 'ADMIN' && <ItemLists title="INCIDENTS" count={data.incidents} />}
        </div>
    );
}

export default Dashboard;
