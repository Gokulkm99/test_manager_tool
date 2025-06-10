import React, { useState, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { AuthContext } from '../../AuthContext';
  import { toast } from 'react-toastify';
  import LoginUI from './LoginUI';

  const LoginFunctionality = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        toast.error('Invalid username or password', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    const handleForgotPassword = async () => {
      if (!username) {
        toast.warn('Please enter your username to reset your password', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/api/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.info(data.message, {
            position: 'top-right',
            autoClose: 5000,
          });
        } else {
          toast.error(data.error || 'Failed to send password reset email', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred. Please try again later.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    };

    return (
      <LoginUI
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleForgotPassword={handleForgotPassword}
      />
    );
  };

  export default LoginFunctionality;