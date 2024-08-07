/* eslint-disable jsx-a11y/no-static-element-interactions */
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonIcon from '@mui/icons-material/Person';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TableChartIcon from '@mui/icons-material/TableChart';
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColorContext } from '../../ColorContext/darkContext';
import './Sidebar.scss';

function Sidebar() {
    const { darkMode, role } = useContext(ColorContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Role:", role);
    }, [role]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('serviceId'); // Suppression de tout autre stockage local pertinent
        navigate('/');
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
            ];
        }

        return { mainLinks, listLinks, settingsLinks };
    };

    const { mainLinks, listLinks, settingsLinks } = renderLinks();

    return (
        <div className="sidebar">
            <div className="logo">
                <Link to="/home" style={{ textDecoration: 'none' }}>
                    <h3 className="text_none">AdminDashboard</h3>
                </Link>
            </div>

            <div className="links">
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
        </div>
    );
}

export default Sidebar;
