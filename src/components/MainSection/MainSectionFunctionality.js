import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainSectionUI from './MainSectionUI';

const MainSectionFunctionality = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return <MainSectionUI handleDashboard={handleDashboard} />;
};

export default MainSectionFunctionality;