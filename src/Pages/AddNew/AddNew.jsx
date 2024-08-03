/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import Input from '../../Components/Input/Input';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import noImage from '../../Images/photo-camera.png';
import './New.scss';

function AddNew({ inputs, titlee, type }) {
    let dynamicInpVal;

    // Dynamically change the state values based on type
    switch (type) {
        case 'SERVICE':
            dynamicInpVal = {
                nomService: '',
                typeService: '',
                addresseService: '',
                nomCompletAdmin: '',
                emailAdmin: '',
                telAdmin: '',
                passwordAdmin: '',
            };
            break;
        case 'INCIDENT':
            dynamicInpVal = {
                nomIncident: '',
                description: '',
                typeServices: [],
                photo: '',
            };
            break;
        case 'URGENTISTE':
            dynamicInpVal = {
                nomComplet: '',
                email: '',
                tel: '',
                password: '',
                serviceId: localStorage.getItem('serviceId') || '', // récupérer le serviceId depuis le localStorage
            };
            break;
        default:
            break;
    }

    const [userInp, setUserInp] = useState(dynamicInpVal);
    const [file, setFile] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            let apiUrl;
            const formData = new FormData();

            if (type === 'SERVICE') {
                apiUrl = '/api/admin/createServiceWithAdmin';
                Object.keys(userInp).forEach(key => {
                    formData.append(key, userInp[key]);
                });
            } else if (type === 'URGENTISTE') {
                apiUrl = '/api/serviceAdmin/createUrgentiste';
                Object.keys(userInp).forEach(key => {
                    formData.append(key, userInp[key]);
                });
            } else if (type === 'INCIDENT') {
                apiUrl = '/api/admin/add-incident';
                formData.append('nomIncident', userInp.nomIncident);
                formData.append('description', userInp.description);
                formData.append('typeServices', userInp.typeServices.join(','));
                if (file) {
                    formData.append('photo', file);
                }
            }

            const response = await axiosInstance.post(apiUrl, formData, config);
            console.log(response.data);
            setSuccessMessage(`${type.charAt(0) + type.slice(1).toLowerCase()} créé avec succès !`);
            setTimeout(() => {
                navigate('/home');
            }, 2000); // Redirige après 2 secondes
        } catch (error) {
            console.error(`There was an error creating the ${type.toLowerCase()}!`, error);
        }
    };

    // Filter inputs based on the type
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
                                <img src={file ? URL.createObjectURL(file) : noImage} alt="" />
                            </div>
                        )}

                        {successMessage && <p className="success_message">{successMessage}</p>}

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
        </div>
    );
}

export default AddNew;
