import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';

const useDashboardLogic = () => {
  const { user, hasAccess } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('ACHIEVE');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [apiKey, setApiKey] = useState(null);

  // Fetch user settings to get Redmine API key
  useEffect(() => {
    if (!user || !hasAccess('/dashboard')) return;

    const fetchUserSettings = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user-settings/${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user settings: ${response.statusText}`);
        }
        const settings = await response.json();
        setApiKey(settings.redmine_api_key || null);
        if (!settings.redmine_api_key) {
          setError('No Redmine API key found. Please configure it in settings.');
        }
      } catch (err) {
        console.error('Error fetching user settings:', err);
        setError('Failed to load user settings. Please check your settings.');
      }
    };

    fetchUserSettings();
  }, [user, hasAccess]);

  // Fetch tickets for ACHIEVE tab
  useEffect(() => {
    if (activeTab !== 'ACHIEVE' || !user || !hasAccess('/dashboard') || !apiKey) return;

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'http://localhost:4000/api/redmine/issues',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Redmine-API-Key': apiKey,
            },
          }
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(`${data.error || 'Failed to fetch tickets'}${data.details ? `: ${data.details}` : ''}`);
        }
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Invalid response format: Expected JSON, received ${contentType || 'unknown'} - ${text.slice(0, 100)}...`);
        }
        const data = await response.json();
        if (!data.issues) {
          throw new Error('Invalid response format: No issues found');
        }
        setTickets(data.issues);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(
          err.message.includes('Redmine API error')
            ? `Error fetching tickets: ${err.message}. Please verify your Redmine API key or contact the server administrator.`
            : `Error fetching tickets: ${err.message}`
        );
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [activeTab, user, hasAccess, apiKey]);

  // Handle ticket selection
  const handleSelectTicket = (ticketId) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  return {
    activeTab,
    setActiveTab,
    tickets,
    loading,
    error,
    selectedTickets,
    handleSelectTicket,
    hasAccess,
  };
};

export default useDashboardLogic;