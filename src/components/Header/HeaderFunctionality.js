import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import HeaderUI from './HeaderUI';

const HeaderFunctionality = () => {
  const { user, logout, hasAccess } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: 'Home', path: '/' },
    { name: 'Task Manager', path: '/task-manager' },
    { name: 'Testcase Generator', path: '/testcase-generator' },
    { name: 'Test Report Generator', path: '/test-report-generator' },
    { name: 'Status Mail Formatter', path: '/status-mail-formatter' },
    { name: 'User Manager', path: '/user-manager' },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleTabClick = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <HeaderUI
      user={user}
      dropdownOpen={dropdownOpen}
      setDropdownOpen={setDropdownOpen}
      drawerOpen={drawerOpen}
      toggleDrawer={toggleDrawer}
      tabs={tabs}
      location={location}
      hasAccess={hasAccess}
      handleTabClick={handleTabClick}
      handleLogout={handleLogout}
      navigate={navigate}
    />
  );
};

export default HeaderFunctionality;