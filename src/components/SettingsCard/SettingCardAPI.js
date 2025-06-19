import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import SettingsCardUI from './SettingsCardUI';

const SettingsCardFunctionality = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [settings, setSettings] = useState({
    greeting: '',
    name: '',
    mobile: '',
    email: '',
    designation: '',
    to_emails: '',
    cc_emails: '',
    redmine_api_key: '', // Add redmine_api_key
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/user-settings/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError('Failed to load settings');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:4000/api/user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ...settings }),
      });
      await updateUser({ username: settings.name, email: settings.email, designation: settings.designation });
      setSuccess('Settings saved successfully');
      setError('');
    } catch (err) {
      setError('Failed to save settings');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <SettingsCardUI
      settings={settings}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      error={error}
      success={success}
    />
  );
};

export default SettingsCardFunctionality;