import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import TableList from '../TableList/TableListServices';
import './orders.scss';

function Orders() {
    const location = useLocation();

    // Déterminez le titre basé sur le chemin
    let pageTitle = '';
    if (location.pathname.includes('/signalement')) {
        pageTitle = 'Voici les signalement';
    } else if (location.pathname.includes('/urgentiste')) {
        pageTitle = 'Voici les urgences';
    }

    return (
        <div className="orders">
            <div className="home_sidebar">
                <Sidebar />
            </div>

            <div className="orders_main">
                <Navbar />

                {/* Affichez le titre */}
                {pageTitle && <h3>{pageTitle}</h3>}

                <TableList />
            </div>
        </div>
    );
}

export default Orders;

