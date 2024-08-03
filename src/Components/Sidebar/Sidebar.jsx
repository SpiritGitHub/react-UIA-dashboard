/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ColorContext } from '../../ColorContext/darkContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TableChartIcon from '@mui/icons-material/TableChart';
import './Sidebar.scss';

function Sidebar() {
    const { darkMode, role } = useContext(ColorContext);

    useEffect(() => {
        console.log("Role:", role);
    }, [role]);

    const renderLinks = () => {
        let mainLinks = [];
        let listLinks = [];
        let settingsLinks = [
            { path: "/profile", label: "Profile", icon: <AccountCircleIcon className="icon" /> },
            { path: "/settings", label: "Réglages", icon: <SettingsRoundedIcon className="icon" /> },
            { path: "/logout", label: "Deconnexion", icon: <LogoutIcon className="icon" /> },
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
                { path: "/status", label: "Status", icon: <BarChartIcon className="icon" /> },
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
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
