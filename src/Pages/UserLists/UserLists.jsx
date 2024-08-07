import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import TableListIncidents from '../../Components/TableList/TableListIncidents';
import TableListServices from '../../Components/TableList/TableListServices';
import TableListUrgentistes from '../../Components/TableList/TableListUrgentistes';
import TableListSignalements from '../Blogs/TableListSignalements';
import './userlists.scss';

function Lists({ type, role }) {
    let TableComponent;

    switch (type) {
        case 'emergencydoctor':
        case 'urgentiste':
            TableComponent = TableListUrgentistes;
            break;
        case 'service':
            TableComponent = TableListServices;
            break;
        case 'incident':
            TableComponent = TableListIncidents;
            break;
        case 'signalement': 
            TableComponent = TableListSignalements;
            break;
        default:
            TableComponent = null;
    }

    // Vérification pour afficher le bouton Ajoutez Nouveau sauf pour le rôle 'ADMIN' pour les urgentistes et pour les signalements
    const shouldShowAddNewButton = type !== 'signalement' && !(type === 'urgentiste' && role === 'ADMIN');

    return (
        <div className="list_page">
            <div className="home_sidebar">
                <Sidebar />
            </div>

            <div className="list_page_main">
                <Navbar />

                <div className="data_table">
                    <div className="btnn">
                        {shouldShowAddNewButton && (
                            <Link
                                to={`/${
                                    type === 'service' ? 'services' :
                                    type === 'incident' ? 'incidents' :
                                    type === 'urgentiste' ? 'urgentistes' :
                                    type === 'signalement' ? 'signalements' : 
                                    'blog'}${type !== 'signalement' ? '/addnew' : ''}`} 
                                style={{ textDecoration: 'none' }}
                                >
                                <button type="button">Ajoutez Nouveau</button>
                            </Link>
                        
                        )}
                    </div>

                    {TableComponent && <TableComponent />}
                </div>
            </div>
        </div>
    );
}

export default Lists;
