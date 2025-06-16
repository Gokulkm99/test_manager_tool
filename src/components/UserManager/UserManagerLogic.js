import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';

const useUserManagerLogic = () => {
  const { user, hasAccess } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('details');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privileges, setPrivileges] = useState([]);
  const [toast, setToast] = useState(null);

  // Available permissions (routes/tabs)
  const availablePermissions = [
    '/test-report-generator',
    '/status-mail-formatter',
    '/user-manager',
  ];

  // Fetch users and their privileges from the database
  useEffect(() => {
    if (user?.role !== 'Admin' || !hasAccess('/user-manager')) return;
    const fetchUsersAndPrivileges = async () => {
      try {
        // Fetch all users (non-admins)
        const usersResponse = await fetch('http://localhost:4000/api/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        let usersData = await usersResponse.json();

        // Fetch current user (admin) if not included
        if (user && !usersData.find(u => u.id === user.id)) {
          const currentUserResponse = await fetch(`http://localhost:4000/api/user/${user.id}`);
          if (currentUserResponse.ok) {
            const currentUserData = await currentUserResponse.json();
            usersData = [...usersData, currentUserData];
          }
        }

        // Fetch privileges for each user
        const usersWithPrivileges = await Promise.all(
          usersData.map(async (u) => {
            try {
              const privilegesResponse = await fetch(`http://localhost:4000/api/privileges/${u.id}`);
              const privilegesData = await privilegesResponse.json();
              if (privilegesResponse.ok) {
                // Convert privileges object to array of tab names with has_access: true
                const userPrivileges = Object.entries(privilegesData.privileges || {})
                  .filter(([_, hasAccess]) => hasAccess)
                  .map(([tabName]) => tabName);
                return { ...u, privileges: userPrivileges };
              }
              return { ...u, privileges: [] };
            } catch (err) {
              console.error(`Error fetching privileges for user ${u.id}:`, err);
              return { ...u, privileges: [] };
            }
          })
        );

        setUsers(usersWithPrivileges);
      } catch (error) {
        showToast('danger', 'Error fetching users: ' + error.message);
      }
    };
    fetchUsersAndPrivileges();
  }, [user, hasAccess]);

  // Show toast notification
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setPrivileges(user.privileges || []);
  };

  // Handle privilege toggle
  const handlePrivilegeChange = (permission) => {
    setPrivileges((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  // Save privilege changes (called after modal confirmation)
  const handleSavePrivileges = async () => {
    if (!selectedUser) return;
    try {
      // Convert privileges array to the format expected by the backend
      const privilegesPayload = availablePermissions.map((tab_name) => ({
        tab_name,
        has_access: privileges.includes(tab_name),
      }));

      const response = await fetch(`http://localhost:4000/api/user-privileges/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(privilegesPayload),
      });

      if (!response.ok) throw new Error('Failed to update privileges');
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, privileges } : u
        )
      );
      setSelectedUser({ ...selectedUser, privileges });
      showToast('success', 'Privileges updated successfully.');
    } catch (error) {
      showToast('danger', 'Error updating privileges: ' + error.message);
    }
  };

  // Delete user (called after modal confirmation)
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await fetch(`http://localhost:4000/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
      setPrivileges([]);
      showToast('success', 'User deleted successfully.');
    } catch (error) {
      showToast('danger', 'Error deleting user: ' + error.message);
    }
  };

  return {
    activeTab,
    setActiveTab,
    users,
    selectedUser,
    privileges,
    availablePermissions,
    toast,
    setToast,
    hasAccess,
    user,
    handleSelectUser,
    handlePrivilegeChange,
    handleSavePrivileges,
    handleDeleteUser,
  };
};

export default useUserManagerLogic;