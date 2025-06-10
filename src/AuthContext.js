import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userPrivileges, setUserPrivileges] = useState({});

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') { // Prevent parsing "undefined"
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') { // Ensure it's a valid object
          setUser(parsedUser);
          fetchPrivileges(parsedUser.id);
        } else {
          console.error('Stored user data is not a valid object:', parsedUser);
          localStorage.removeItem('user'); // Clean up invalid data
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('user'); // Clean up invalid data
      }
    }
  }, []);

  const fetchPrivileges = async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/privileges/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setUserPrivileges(data.privileges || {});
      } else {
        console.error('Failed to fetch privileges:', data.error);
        setUserPrivileges({});
      }
    } catch (err) {
      console.error('Error fetching privileges:', err);
      setUserPrivileges({});
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.user && typeof data.user === 'object') {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        await fetchPrivileges(data.user.id);
        return true;
      } else {
        console.error('Login failed:', data.error || 'Invalid user data');
        localStorage.removeItem('user'); // Ensure invalid data is not stored
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      localStorage.removeItem('user'); // Clean up on error
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserPrivileges({});
    localStorage.removeItem('user');
  };

  const hasAccess = (path) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    if (path === '/') return true;
    return userPrivileges[path] || false;
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:4000/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess, userPrivileges, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};