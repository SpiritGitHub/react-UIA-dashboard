import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import TableListIncidents from '../../Components/TableList/TableListIncidents';
import TableListServices from '../../Components/TableList/TableListServices';
import TableListUrgentistes from '../../Components/TableList/TableListUrgentistes';
import './Detail.scss';

function Detail() {
    const location = useLocation();

    const emergencydoctorPath = '/emergencydoctors'
    const servicesPath = '/services';
    const incidentsPath = '/incidents';
    const urgentistesPath = '/urgentistes';

    let displayText;
    let TableComponent;

    console.log("Current pathname:", location.pathname); // Debugging log

    switch (location.pathname) {
        case emergencydoctorPath:
            displayText = "Emergency Doctors";
            TableComponent = TableListUrgentistes;
            break
        case servicesPath:
            displayText = "All Services";
            TableComponent = TableListServices;
            break;
        case incidentsPath:
            displayText = "All Incidents";
            TableComponent = TableListIncidents;
            break;
        case urgentistesPath:
            displayText = "All Urgentistes";
            TableComponent = TableListUrgentistes;
            break;
        default:
            displayText = "Unknown Path";
            TableComponent = null;
    }

    console.log("Selected Table Component:", TableComponent); // Debugging log

    return (
        <div className="details">
            <div className="home_sidebar">
                <Sidebar />
            </div>

            <div className="detail_page_main">
                <Navbar />

                <div className="table">
                    {TableComponent && <TableComponent />}
                </div>
            </div>
        </div>
    );
}

export default Detail;
