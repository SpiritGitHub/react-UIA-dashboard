import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axiosInstance from '../../axiosConfig';
import Input from '../../Components/Input/Input';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import noImage from '../../Images/photo-camera.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './New.scss';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';  // Import de l'icône

function AddNew({ inputs, titlee, type }) {
    const initialState = {
        SERVICE: {
            nomService: '',
            typeService: '',
            addresseService: '',
            telephoneService: '',
            nomCompletAdmin: '',
            emailAdmin: '',
            telAdmin: '',
        },
        INCIDENT: {
            nomIncident: '',
            description: '',
            typeServices: [],
            photo: '',
        },
        URGENTISTE: {
            nomComplet: '',
            email: '',
            tel: '',
            serviceId: localStorage.getItem('serviceId') || '',
        }
    };

    const [userInp, setUserInp] = useState(initialState[type]);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInp({ ...userInp, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setUserInp((prevState) => {
            const updatedServices = checked
                ? [...prevState.typeServices, name]
                : prevState.typeServices.filter((service) => service !== name);
            return { ...prevState, typeServices: updatedServices };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if typeService is empty
        if (type === 'SERVICE' && !userInp.typeService) {
            toast.error("Veuillez sélectionner un type de service.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            let apiUrl;
            let payload;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': type === 'INCIDENT' ? 'multipart/form-data' : 'application/json',
                },
            };

            if (type === 'SERVICE') {
                apiUrl = '/api/admin/createServiceWithAdmin';
                payload = JSON.stringify(userInp);
                console.log('Payload:', payload); // Log the payload
            } else if (type === 'URGENTISTE') {
                apiUrl = '/api/serviceAdmin/createUrgentiste';
                payload = JSON.stringify(userInp);
            } else if (type === 'INCIDENT') {
                apiUrl = '/api/admin/add-incident';
                payload = new FormData();
                payload.append('nomIncident', userInp.nomIncident);
                payload.append('description', userInp.description);
                payload.append('typeServices', userInp.typeServices.join(','));
                if (file) {
                    payload.append('photo', file);
                }
            }

            await axiosInstance.post(apiUrl, payload, config);
            toast.success(`${type.charAt(0) + type.slice(1).toLowerCase()} créé avec succès !`);
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (error) {
            toast.error(`Il y a eu une erreur lors de la création du ${type.toLowerCase()} !`);
            console.error(`There was an error creating the ${type.toLowerCase()}!`, error);
        }
    };

    const getRelevantInputs = () => {
        if (type === 'SERVICE') {
            return inputs.filter(input => input.section === 'service' || input.section === 'admin');
        } else if (type === 'INCIDENT') {
            return [
                { id: 'nomIncident', name: 'nomIncident', type: 'text', placeholder: 'Nom de l\'Incident' },
                { id: 'description', name: 'description', type: 'text', placeholder: 'Description' }
            ];
        } else if (type === 'URGENTISTE') {
            return inputs;
        }
        return [];
    };

    const relevantInputs = getRelevantInputs();

    return (
        <div className="add_new">
            <div className="home_sidebar">
                <Sidebar />
            </div>

            <div className="new_page">
                <Navbar />

                <div className="new_page_main">
                    <div className="new_page_content">
                        <p className="add_new_user">{titlee}</p>

                        {type !== 'SERVICE' && type !== 'URGENTISTE' && (
                            <div className="image">
                                <img src={file ? URL.createObjectURL(file) : noImage} alt="Incident" />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="form">
                            {type !== 'SERVICE' && type !== 'URGENTISTE' && (
                                <div className="form_inp">
                                    <label htmlFor="file">
                                        Upload: <DriveFolderUploadIcon className="file_icon" />
                                    </label>
                                    <input
                                        type="file"
                                        name="file"
                                        id="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>
                            )}

                            {type === 'SERVICE' && (
                                <>
                                    <div className="section">
                                        <h3>Informations sur le Service</h3>
                                        {relevantInputs.filter(input => input.section === 'service').map((detail) => (
                                            <Input
                                                key={detail.id}
                                                {...detail}
                                                value={userInp[detail.name]}
                                                onChange={handleChange}
                                            />
                                        ))}
                                        <div className="form_inp">
                                            <label htmlFor="typeService">Type de Service:</label>
                                            <select
                                                id="typeService"
                                                name="typeService"
                                                value={userInp.typeService}
                                                onChange={handleChange}
                                            >
                                                <option value="">Choisir un type</option>
                                                <option value="POMPIER">Pompier</option>
                                                <option value="POLICIER">Policier</option>
                                                <option value="AMBULANCIER">Ambulancier</option>
                                            </select>
                                        </div>
                                        <div className="form_inp">
                                            <label htmlFor="telephoneService">Téléphone du Service:</label>
                                            <input
                                                id="telephoneService"
                                                name="telephoneService"
                                                type="text"
                                                value={userInp.telephoneService}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="section">
                                        <h3>Informations sur l'Administrateur</h3>
                                        {relevantInputs.filter(input => input.section === 'admin').map((detail) => (
                                            <Input
                                                key={detail.id}
                                                {...detail}
                                                value={userInp[detail.name]}
                                                onChange={handleChange}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {type === 'URGENTISTE' && (
                                <div className="section">
                                    <h3>Informations sur l'Urgentiste</h3>
                                    {relevantInputs.map((input) => (
                                        <Input
                                            key={input.id}
                                            {...input}
                                            value={userInp[input.name]}
                                            onChange={handleChange}
                                        />
                                    ))}
                                </div>
                            )}

                            {type === 'INCIDENT' && (
                                <div className="section">
                                    <h3>Informations sur l'Incident</h3>
                                    {relevantInputs.map((input) => (
                                        <Input
                                            key={input.id}
                                            {...input}
                                            value={userInp[input.name]}
                                            onChange={handleChange}
                                        />
                                    ))}
                                    <div className="form_inp">
                                        <h3>Type de Services:</h3>
                                        <div className="checkbox_group">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="POMPIER"
                                                    checked={userInp.typeServices.includes('POMPIER')}
                                                    onChange={handleCheckboxChange}
                                                />
                                                Pompier
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="POLICIER"
                                                    checked={userInp.typeServices.includes('POLICIER')}
                                                    onChange={handleCheckboxChange}
                                                />
                                                Policier
                                            </label>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    name="AMBULANCIER"
                                                    checked={userInp.typeServices.includes('AMBULANCIER')}
                                                    onChange={handleCheckboxChange}
                                                />
                                                Ambulancier
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="submit_btn">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

AddNew.propTypes = {
    inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
    titlee: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['SERVICE', 'INCIDENT', 'URGENTISTE']).isRequired,
};

export default AddNew;
