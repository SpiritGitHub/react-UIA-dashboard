import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColorContext } from '../../ColorContext/darkContext';
import axiosInstance from '../../axiosConfig';
import Notification from '../NotificationList/Notification';

// Importations des icônes depuis @mui/icons-material
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TableChartIcon from '@mui/icons-material/TableChart';

// Importation de l'image
import admin from '../../Images/admin_pic.jpg';

// Importation du fichier SCSS
import './navbar.scss';

function Navbar() {
    const { darkMode, dispatch } = useContext(ColorContext);
    const navigate = useNavigate();
    const [toggle, setToggle] = useState(false);
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedEmail = localStorage.getItem('email');
        const storedServiceId = localStorage.getItem('serviceId');
        setRole(storedRole);
        setEmail(storedEmail);
        setServiceId(storedServiceId);

        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                let endpoint = '';
                if (storedRole === 'ADMIN') {
                    endpoint = '/api/admin-notifications';
                } else if (storedRole === 'SERVICE_ADMIN') {
                    endpoint = `/api/serviceAdmin/notificationservice/${storedServiceId}`;
                }
                const response = await axiosInstance.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setNotifications(response.data);
                setUnreadCount(response.data.filter(n => !n.read).length);
            } catch (error) {
                console.error('Erreur lors de la récupération des notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleToggle = () => {
        setToggle(!toggle);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('serviceId');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            let endpoint = '';
            if (role === 'ADMIN') {
                endpoint = `/api/admin-notifications/${notificationId}/read`;
            } else if (role === 'SERVICE_ADMIN') {
                endpoint = `/api/serviceAdmin/markAsRead/${notificationId}`;
            }
            await axiosInstance.put(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setNotifications(notifications.map(n => (n.id === notificationId ? { ...n, read: true } : n)));
            setUnreadCount(unreadCount - 1);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'état de lecture de la notification:', error);
        }
    };

    const renderLinks = () => {
        let mainLinks = [];
        let listLinks = [];
        let settingsLinks = [
            { path: "/profile", label: "Profile", icon: <AccountCircleIcon className="icon" /> },
            { path: "/settings", label: "Réglages", icon: <SettingsRoundedIcon className="icon" /> },
        ];

        if (role === 'ADMIN') {
            mainLinks = [
                { path: "/home", label: "Dashboard", icon: <DashboardIcon className="icon" /> },
            ];
            listLinks = [
                { path: "/services", label: "Services", icon: <PersonIcon className="icon" /> },
                { path: "/incidents", label: "Incidents", icon: <TableChartIcon className="icon" /> },
                { path: "/signalements", label: "Signalement", icon: <CreditCardIcon className="icon" /> },
                { path: "/urgentistes", label: "Urgentistes", icon: <CreditCardIcon className="icon" /> },
                { path: "/notifications", label: "Notification", icon: <NotificationsNoneIcon className="icon" /> },

            ];
        } else if (role === 'SERVICE_ADMIN') {
            mainLinks = [
                { path: "/home", label: "Dashboard", icon: <DashboardIcon className="icon" /> },
            ];
            listLinks = [
                { path: "/urgentistes", label: "Urgentistes", icon: <CreditCardIcon className="icon" /> },
                { path: "/signalements", label: "Signalement", icon: <CreditCardIcon className="icon" /> },
                { path: "/notifications", label: "Notification", icon: <NotificationsNoneIcon className="icon" /> },

            ];
        }

        return { mainLinks, listLinks, settingsLinks };
    };

    const { mainLinks, listLinks, settingsLinks } = renderLinks();

    return (
        <div className="navbar">
            <div className="navbar_main">
                <div className="menu_logo">
                    {toggle ? (
                        <CloseIcon className="menu_icon" onClick={handleToggle} />
                    ) : (
                        <MenuIcon className="menu_icon" onClick={handleToggle} />
                    )}
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h3 className="text_none">Dashboard</h3>
                    </Link>
                </div>

                <div className="item_lists">
                    <div className="item">
                        {!darkMode ? (
                            <DarkModeIcon
                                className="item_icon"
                                onClick={() => dispatch({ type: 'TOGGLE' })}
                            />
                        ) : (
                            <LightModeIcon
                                className="item_icon white"
                                onClick={() => dispatch({ type: 'TOGGLE' })}
                            />
                        )}
                    </div>
                    <div className="item">
                        <div className="notification_icon" onClick={handleNotificationClick}>
                            <NotificationsNoneIcon className="item_icon" />
                            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                        </div>
                    </div>
                    <div className="item">
                        <img className="admin_pic" src={admin} alt="admin" />
                        <p className="admin_email">{email}</p>
                    </div>
                </div>
            </div>

            <div className="res_navbar">
                {toggle && (
                    <div className="res_nav_menu">
                        <ul>
                            <p className="spann">Main</p>
                            {mainLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} style={{ textDecoration: 'none' }}>
                                        {link.icon}
                                        <span className="link-label">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                            <p className="spann">Lists</p>
                            {listLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} style={{ textDecoration: 'none' }}>
                                        {link.icon}
                                        <span className="link-label">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                            <p className="spann">Settings</p>
                            {settingsLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} style={{ textDecoration: 'none' }}>
                                        {link.icon}
                                        <span className="link-label">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <div onClick={handleLogout} className="logout_button" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    <LogoutIcon className="icon" />
                                    <span className="link-label">Déconnexion</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {showNotifications && (
                <Notification
                    notifications={notifications}
                    handleMarkAsRead={handleMarkAsRead}
                    role={role}
                />
            )}
        </div>
    );
}

export default Navbar;
