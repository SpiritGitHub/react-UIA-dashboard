import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig'; // Notez le chemin relatif

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        services: 0,
        signalement: 0,
        urgentistes: 0,
        incidents: 0,
    });
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null)
    const [serviceId, setServiceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl;
                const options = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
    
                if (role === 'ADMIN') {
                    apiUrl = 'api/admin/models/counts';
                } else if (role === 'SERVICE_ADMIN' && serviceId) {
                    apiUrl = `api/serviceAdmin/counts/${serviceId}`;
                }
    
                if (apiUrl) {
                    const response = await axiosInstance.get(apiUrl, options);
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
                console.error('Erreur lors de la récupération des données:', error);
                setError(error.response?.data?.message || 'Erreur lors de la récupération des données');
            } finally {
                setLoading(false);
            }
        };
    
        if (role !== null) {
            fetchData();
        }
    }, [role, serviceId, token]); 

    return (
        <DataContext.Provider value={{ data, role, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};
