import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { ColorContext } from '../../ColorContext/darkContext';
import Chart from '../Chart/Chart';
import ItemLists from '../ItemLists/ItemLists';
import Navbar from '../Navbar/Navbar';
import ProgressBar from '../ProgressBar/ProgressBar';
import Sidebar from '../Sidebar/Sidebar';
import EventHistoryTable from '../EventHistoryTable/EventHistoryTable'; // Import the EventHistoryTable component
import './Home.scss';

function Home() {
    const { role } = useContext(ColorContext);
    const [data, setData] = useState({
        services: 0,
        signalement: 0,
        urgentistes: 0,
        incidents: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let apiUrl;
                const serviceId = localStorage.getItem('serviceId');
                const token = localStorage.getItem('token');

                if (role === 'ADMIN') {
                    apiUrl = 'api/admin/models/counts';
                } else if (role === 'SERVICE_ADMIN' && serviceId) {
                    apiUrl = `api/serviceAdmin/counts/${serviceId}`;
                }

                if (apiUrl && token) {
                    const response = await axiosInstance.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
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
                setError('Erreur lors de la récupération des données');
                console.error('Erreur lors de la récupération des données:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [role]);

    const renderItems = () => {
        if (role === 'ADMIN') {
            return (
                <>
                    <ItemLists title="SERVICES" count={data.services} />
                    <ItemLists title="SIGNALEMENT" count={data.signalement} />
                    <ItemLists title="URGENTISTES" count={data.urgentistes} />
                    <ItemLists title="INCIDENTS" count={data.incidents} />
                </>
            );
        } else if (role === 'SERVICE_ADMIN') {
            return (
                <>
                    <ItemLists title="URGENTISTES" count={data.urgentistes} />
                    <ItemLists title="SIGNALEMENT" count={data.signalement} />
                </>
            );
        }
        return null;
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="home">
            <div className="home_sidebar">
                <Sidebar />
            </div>
            <div className="home_main">
                <Navbar />
                <div className="bg_color" />
                <div className="home_items">
                    {renderItems()}
                </div>
                {role === 'ADMIN' && (
                    <>
                        <div className="chart_sec">
                            <Chart height={450} title="Revenue" />
                        </div>
                        <div className="table">
                            <div className="title">Historique des événements</div>
                            <EventHistoryTable /> {/* Add the new component here */}
                        </div>
                    </>
                )}
                {role === 'SERVICE_ADMIN' && (
                    <div className="table">
                        <div className="title">Historique des événements</div>
                        <EventHistoryTable /> {/* Add the new component here */}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
