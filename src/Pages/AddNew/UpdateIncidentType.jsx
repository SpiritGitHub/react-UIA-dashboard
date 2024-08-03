import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import Input from '../../Components/Input/Input';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import noImage from '../../Images/photo-camera.png';
import './New.scss';

function UpdateIncidentType({ inputs, titlee, type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incidentData, setIncidentData] = useState({
    nomincident: '',
    photoIncidentType: '',
    description: '',
    typeServices: [],
  });
  const [file, setFile] = useState(null); // Remplacer par null pour faciliter la vérification
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axiosInstance
      .get(`/api/admin/incidentbyid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        setIncidentData({
          nomincident: data.nomincident || '',
          photoIncidentType: data.photoIncidentType || '',
          description: data.description || '',
          typeServices: data.typeServices || [],
        });
      })
      .catch((error) => {
        console.error('There was an error fetching the incident data!', error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidentData({
      ...incidentData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIncidentData((prevState) => {
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

      const formData = new FormData();
      formData.append('nomIncident', incidentData.nomincident);
      formData.append('description', incidentData.description);
      formData.append('typeServices', incidentData.typeServices.join(','));

      // Ajout conditionnel du fichier
      if (file) {
        formData.append('photo', file);
      } else {
        // Re-téléchargement de l'image à partir de l'URL (peut ne pas être idéal)
        const response = await fetch(incidentData.photoIncidentType);
        const blob = await response.blob();
        formData.append('photo', new File([blob], "existing_photo.jpg", { type: blob.type }));
      }

      const response = await axiosInstance.put(`/api/admin/updateincident/${id}`, formData, config);
      console.log(response.data);
      setSuccessMessage(`Incident mis à jour avec succès !`);
      setTimeout(() => {
        navigate('/incidents');
      }, 2000); // Redirige après 2 secondes
    } catch (error) {
      console.error('There was an error updating the incident type!', error);
    }
  };

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

            <div className="image">
              <img src={file ? URL.createObjectURL(file) : incidentData.photoIncidentType || noImage} alt="" />
            </div>

            {successMessage && <p className="success_message">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="form">
              <div className="form_inp">
                <label htmlFor="file">
                  Upload:
                  <DriveFolderUploadIcon className="file_icon" />
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  style={{ display: 'none' }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              <div className="section">
                <h3>Informations sur l'Incident</h3>
                <label htmlFor="nomincident">Nom de l'Incident:</label>
                <Input
                  id="nomincident"
                  name="nomincident"
                  type="text"
                  placeholder="Nom de l'Incident"
                  value={incidentData.nomincident}
                  onChange={handleChange}
                />
                <label htmlFor="description">Description:</label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Description"
                  value={incidentData.description}
                  onChange={handleChange}
                />
                <div className="form_inp">
                  <h3>Type de Services:</h3>
                  <div className="checkbox_group">
                    <label>
                      <input
                        type="checkbox"
                        name="POMPIER"
                        checked={incidentData.typeServices.includes('POMPIER')}
                        onChange={handleCheckboxChange}
                      />
                      Pompier
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="POLICIER"
                        checked={incidentData.typeServices.includes('POLICIER')}
                        onChange={handleCheckboxChange}
                      />
                      Policier
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="AMBULANCIER"
                        checked={incidentData.typeServices.includes('AMBULANCIER')}
                        onChange={handleCheckboxChange}
                      />
                      Ambulancier
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit_btn">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateIncidentType;
