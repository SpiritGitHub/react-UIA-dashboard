import React, { useContext } from 'react';
import { ColorContext } from '../../ColorContext/darkContext';
import Chart from '../Chart/Chart';
import ItemLists from '../ItemLists/ItemLists';
import Navbar from '../Navbar/Navbar';
import ProgressBar from '../ProgressBar/ProgressBar';
import Sidebar from '../Sidebar/Sidebar';
import TableList from '../TableList/TableListServices';
import './Home.scss';

function Home() {
    const { role } = useContext(ColorContext);

    // Logique conditionnelle pour décider quels composants afficher
    const renderItems = () => {
        if (role === 'ADMIN') {
            return (
                <>
                    <ItemLists type="services" />
                    <ItemLists type="signalement" />
                    <ItemLists type="urgentistes" />
                    <ItemLists type="incident" />
                </>
            );
        } else if (role === 'SERVICE_ADMIN') {
            return (
                <>
                    <ItemLists type="urgentistes" />
                    <ItemLists type="signalement" />
                </>
            );
        }
        return null; // Ou un message indiquant que l'utilisateur n'a pas d'accès
    };

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
                            <ProgressBar />
                            <Chart height={450} title="Revenue" />
                        </div>

                        <div className="table">
                            <div className="title">Latest Transactions</div>
                            <TableList />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;
