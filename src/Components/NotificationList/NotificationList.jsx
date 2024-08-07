// src/Components/NotificationList/NotificationList.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import './NotificationList.scss';

const NotificationList = ({ filter }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get(`/api/notifications?status=${filter}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(response.data);
            } catch (error) {
                setError('Erreur lors de la récupération des notifications');
                console.error('Erreur lors de la récupération des notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [filter]);

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axiosInstance.post(
                '/api/notifications/mark-all-as-read',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotifications(notifications.map(notification => ({ ...notification, status: 'read' })));
        } catch (error) {
            console.error('Erreur lors de la mise à jour des notifications:', error);
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="notification_list">
            <div className="header">
                <h2>{filter === 'unread' ? 'Notifications non lues' : 'Notifications lues'}</h2>
                <button onClick={markAllAsRead}>Marquer tout comme lu</button>
            </div>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id} className={notification.status === 'unread' ? 'unread' : 'read'}>
                        <p>{notification.message}</p>
                        <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
