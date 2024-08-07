// src/Components/EventHistoryTable/EventHistoryTable.js
import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { ColorContext } from '../../ColorContext/darkContext';
import './EventHistoryTable.scss';

const EventHistoryTable = () => {
    const { role } = useContext(ColorContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl;
                const serviceId = localStorage.getItem('serviceId');
                const token = localStorage.getItem('token');

                if (role === 'ADMIN') {
                    apiUrl = 'api/admin/all-historique';
                } else if (role === 'SERVICE_ADMIN' && serviceId) {
                    apiUrl = `api/serviceAdmin/service-historique/${serviceId}`;
                }

                if (apiUrl && token) {
                    const response = await axiosInstance.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setEvents(response.data);
                }
            } catch (error) {
                setError('Erreur lors de la récupération des événements');
                console.error('Erreur lors de la récupération des événements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [role]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <table className="event-history-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type d'événement</th>
                    <th>Description</th>
                    <th>Utilisateur</th>
                    {role === 'ADMIN' && <th>Service</th>}
                </tr>
            </thead>
            <tbody>
                {events.map(event => (
                    <tr key={event.id}>
                        <td>{new Date(event.timestamp).toLocaleDateString()}</td>
                        <td>{event.eventType}</td>
                        <td>{event.description}</td>
                        <td>{event.userName}</td>
                        {role === 'ADMIN' && <td>{event.serviceName}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default EventHistoryTable;
