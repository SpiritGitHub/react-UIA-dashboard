import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { ColorContext } from '../../ColorContext/darkContext';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Input from '../../Components/Input/Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.scss';

const ProfilePage = () => {
    const { role } = useContext(ColorContext);
    const [profileData, setProfileData] = useState({
        nomComplet: '',
        email: '',
        tel: '',
        password: '',
        nomService: '',
        addresseService: '',
        telephoneService: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                let apiUrl;
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

                if (role === 'ADMIN') {
                    apiUrl = `api/admin/userprofile/${userId}`;
                } else if (role === 'SERVICE_ADMIN') {
                    apiUrl = `api/serviceAdmin/userprofile/${userId}`;
                }

                if (apiUrl && token) {
                    const response = await axiosInstance.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setProfileData(response.data);
                }
            } catch (error) {
                setError('Erreur lors de la récupération des données du profil');
                console.error('Erreur lors de la récupération des données du profil:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let apiUrl;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
            let payload = JSON.stringify(profileData);

            if (role === 'ADMIN') {
                apiUrl = `api/admin/profile/${profileData.userId}`;
            } else if (role === 'SERVICE_ADMIN') {
                apiUrl = `api/serviceAdmin/profile/${profileData.userId}`;
            }

            await axiosInstance.put(apiUrl, payload, config);
            toast.success('Profil mis à jour avec succès !');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du profil !');
            console.error('Erreur lors de la mise à jour du profil:', error);
        }
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile_page">
            <div className="home_sidebar">
                <Sidebar />
            </div>
            <div className="profile_main">
                <Navbar />
                <div className="profile_content">
                    <h2>Mon Profil</h2>
                    <form onSubmit={handleSubmit} className="profile_form">
                        <Input
                            name="nomComplet"
                            type="text"
                            placeholder="Nom Complet"
                            value={profileData.nomComplet}
                            onChange={handleChange}
                        />
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={profileData.email}
                            onChange={handleChange}
                        />
                        <Input
                            name="tel"
                            type="text"
                            placeholder="Téléphone"
                            value={profileData.tel}
                            onChange={handleChange}
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Mot de passe"
                            value={profileData.password}
                            onChange={handleChange}
                        />
                        {role === 'SERVICE_ADMIN' && (
                            <>
                                <Input
                                    name="nomService"
                                    type="text"
                                    placeholder="Nom du Service"
                                    value={profileData.nomService}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="addresseService"
                                    type="text"
                                    placeholder="Adresse du Service"
                                    value={profileData.addresseService}
                                    onChange={handleChange}
                                />
                                <Input
                                    name="telephoneService"
                                    type="text"
                                    placeholder="Téléphone du Service"
                                    value={profileData.telephoneService}
                                    onChange={handleChange}
                                />
                            </>
                        )}
                        <button type="submit" className="submit_btn">
                            Mettre à jour
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ProfilePage;
