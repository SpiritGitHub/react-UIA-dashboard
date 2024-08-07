import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.scss';

function Notification({ notifications, handleMarkAsRead, role }) {
    const navigate = useNavigate();
    const serviceId = localStorage.getItem('serviceId');

    const handleShowMoreClick = () => {
        if (role === 'ADMIN') {
            navigate('/admin-notifications');
        } else if (role === 'SERVICE_ADMIN') {
            navigate('/api/serviceAdmin/notificationservice/${serviceId}');
        }
    };

    return (
        <div className="notification_panel">
            <h3>Notifications</h3>
            <ul>
                {notifications.slice(0, 5).map(notification => (
                    <li key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                        <p>{notification.message}</p>
                        {!notification.read && (
                            <button onClick={() => handleMarkAsRead(notification.id)}>Mark as read</button>
                        )}
                    </li>
                ))}
            </ul>
            {notifications.length > 5 && (
                <button onClick={handleShowMoreClick}>
                    Show More
                </button>
            )}
        </div>
    );
}

export default Notification;
