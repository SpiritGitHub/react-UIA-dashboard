import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'; // Pour services
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'; // Pour signalement
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'; // Pour urgentistes
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'; // Pour incidents
import './itemlists.scss';

function ItemLists({ title, count }) {
    let data = {};

    switch (title) {
        case 'SERVICES':
            data = {
                icon: (
                    <BuildOutlinedIcon
                        style={{
                            color: '#FF74B1',
                            backgroundColor: '#FFD6EC',
                        }}
                        className="icon"
                    />
                ),
                link: 'Voir tous les services',
                linkto: '/services',
            };
            break;
        case 'SIGNALEMENT':
            data = {
                icon: (
                    <ReportProblemOutlinedIcon
                        style={{
                            color: '#AC7088',
                            backgroundColor: '#FFF38C',
                        }}
                        className="icon"
                    />
                ),
                link: 'Voir les signalements',
                linkto: '/signalements',
            };
            break;
        case 'URGENTISTES':
            data = {
                icon: (
                    <LocalHospitalOutlinedIcon
                        style={{
                            color: '#367E18',
                            backgroundColor: '#A7FFE4',
                        }}
                        className="icon"
                    />
                ),
                link: 'Voir tous les urgentistes',
                linkto: '/urgentistes',
            };
            break;
        case 'INCIDENTS':
            data = {
                icon: (
                    <EventAvailableOutlinedIcon
                        style={{
                            color: '#AC7088',
                            backgroundColor: '#B1B2FF',
                        }}
                        className="icon"
                    />
                ),
                link: 'Voir les incidents',
                linkto: '/incidents',
            };
            break;
        default:
            break;
    }

    return (
        <div className="item_listss">
            <div className="name">
                <p>{title}</p>
            </div>
            <div className="counts">
                {count}
            </div>
            <div className="see_item">
                <Link to={data.linkto}>
                    <p>{data.link}</p>
                </Link>
                {data.icon}
            </div>
        </div>
    );
}

ItemLists.propTypes = {
    title: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
};

export default ItemLists;
