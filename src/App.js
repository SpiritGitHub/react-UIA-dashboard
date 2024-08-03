import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './app.scss';
import { ColorContext } from './ColorContext/darkContext';
import Home from './Components/Home/Home';
import Login from './Login/Login';
import AddNew from './Pages/AddNew/AddNew';
import UpdateIncidentType from './Pages/AddNew/UpdateIncidentType';
import BlogDetail from './Pages/BlogDetail/BlogDetail';
import Blogs from './Pages/Blogs/Blogs';
import SignalementDetails from './Pages/Blogs/SignalementDetails';
import Detail from './Pages/Detail/Detail';
import Lists from './Pages/UserLists/UserLists';

const serviceInputs = [
  { id: 1, name: 'nomService', type: 'text', placeholder: 'Nom du Service', section: 'service' },
  { id: 2, name: 'addresseService', type: 'text', placeholder: 'Adresse du Service', section: 'service' },
  { id: 3, name: 'nomCompletAdmin', type: 'text', placeholder: 'Nom Complet de l\'Admin', section: 'admin' },
  { id: 4, name: 'emailAdmin', type: 'email', placeholder: 'Email de l\'Admin', section: 'admin' },
  { id: 5, name: 'telAdmin', type: 'tel', placeholder: 'Téléphone de l\'Admin', section: 'admin' },
  { id: 6, name: 'passwordAdmin', type: 'password', placeholder: 'Mot de passe de l\'Admin', section: 'admin' },
];

const urgentistInputs = [
    { id: 1, name: 'nomComplet', type: 'text', placeholder: 'Nom Complet' },
    { id: 2, name: 'email', type: 'email', placeholder: 'Email' },
    { id: 3, name: 'tel', type: 'tel', placeholder: 'Téléphone' },
    { id: 4, name: 'password', type: 'password', placeholder: 'Mot de passe' },
];


const productInpDetails = [
  {
    id: 2,
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Product title',
    required: true,
    errorMsg: 'Title is required!',
  },
  {
    id: 3,
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Product description',
    required: true,
    errorMsg: 'Description is required!',
  },
  {
    id: 4,
    name: 'category',
    label: 'Category',
    type: 'text',
    placeholder: 'Product category',
    required: true,
    errorMsg: 'Category is required!',
  },
  {
    id: 5,
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: 'Product price',
    required: true,
    errorMsg: 'Price is required!',
  },
  {
    id: 6,
    name: 'stock',
    label: 'In Stock',
    type: 'text',
    placeholder: 'In Stock',
    required: true,
    errorMsg: 'This field is required!',
  },
];

const blogInputs = [
  {
    id: 1,
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Blog title',
    required: true,
    errorMsg: 'Title is required!',
  },
  {
    id: 2,
    name: 'description',
    label: 'Description',
    type: 'text',
    placeholder: 'Blog description',
    required: true,
    errorMsg: 'Description is required!',
  },
  {
    id: 3,
    name: 'tags',
    label: 'Tags',
    type: 'text',
    placeholder: 'Travel, Communication',
    required: true,
    errorMsg: 'Tag is required!',
  },
];


function App() {
  const { darkMode } = useContext(ColorContext);

  return (
    <div className={darkMode ? 'App dark' : 'App'}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="home" element={<Home />} />

          <Route path="services" element={<Lists type="service" />} />
          <Route path=":idService" element={<Detail />} />
          <Route
            path="services/addnew"
            element={
              <AddNew
                inputs={serviceInputs}
                titlee="Add New Service"
                type="SERVICE"
              />
            }
          />

          <Route path="update-incident/:id" element={<UpdateIncidentType />} />
          <Route path="emergencydoctors" element={<Lists type="emergencydoctor" />} />
          <Route path=":idemergencydoctor" element={<Detail />} />
          <Route
            path="emergencydoctors/addnew"
            element={
              <AddNew
                inputs={serviceInputs}
                titlee="Add New emergencydoctor"
                type="EMERGENCY_DOCTOR"
              />
            }
          />

          <Route path="incidents" element={<Lists type="incident" />} />
          <Route path=":Idincident" element={<Detail />} />
          <Route
            path="incidents/addnew"
            element={
              <AddNew
                inputs={productInpDetails}
                titlee="Add New Incident"
                type="INCIDENT"
              />
            }
          />

          <Route path="urgentistes" element={<Lists type="urgentiste" />} />
          <Route path=":idurgentiste" element={<Detail />} />
          <Route
            path="urgentistes/addnew"
            element={
              <AddNew
                inputs={urgentistInputs}
                titlee="Add New Urgentiste"
                type="URGENTISTE"
              />
            }
          />

          <Route path="blogs" element={<Blogs type="blog" />} />
          <Route path="blogs/:blogId" element={<BlogDetail />} />
          <Route
            path="blogs/addnew"
            element={
              <AddNew inputs={blogInputs} titlee="Add New Blog" type="BLOG" />
            }
          />

        <Route path="signalements" element={<Lists type="signalement" />} />
        <Route path="/signalements/:id" element={<SignalementDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
