import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import './Login.scss';

const Login = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorMessage] = useState(''); // Renommé errorMessage en error
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });
      const { jwt, role, userId, serviceId } = response.data; // Assurez-vous que l'API renvoie ces champs
      localStorage.setItem('token', jwt);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email); // Stockage de l'email
      localStorage.setItem('serviceId', serviceId); // Stockage du serviceId
      navigate('/home');
      setErrorMessage(''); // Effacer le message d'erreur en cas de succès
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Échec de la connexion. Veuillez vérifier vos Connexions.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      }
      setErrorMessage(errorMessage); // Mettre à jour le message d'erreur
    }
  };

  return (
    <div className="login-container">
      <h1>Connectez-vous</h1>
      <form onSubmit={handleLogin} className="form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
      <p>
        Pas encore de compte ?
        <Link to="/register">S&apos;inscrire</Link>
      </p>
    </div>
  );
};

export default Login;
