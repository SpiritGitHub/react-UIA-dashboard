import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './Login.scss';

const Login = function () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      });
      const { jwt, role, userId, serviceId } = response.data;
      localStorage.setItem('token', jwt);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('serviceId', serviceId);
      navigate('/home');
      setErrorMessage('');
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Échec de la connexion. Veuillez vérifier vos Connexions.';
      if (error.response && error.response.status === 401) {
        errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      }
      setErrorMessage(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <div className="input-group password-group">
          <label htmlFor="password">Mot de passe</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
