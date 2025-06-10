import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import ErrorBoundary from './ErrorBoundary'; // Import the ErrorBoundary
import HeaderFunctionality from './components/Header/HeaderFunctionality';
import MainSectionFunctionality from './components/MainSection/MainSectionFunctionality';
import ButtonGroup from './components/ButtonGroup';
import UserManagerFunctionality from './components/UserManager/UserManagerFunctionality';
import StatusMailFormatterFunctionality from './components/StatusMailFormatter/StatusMailFormatterFunctionality';
import LoginFunctionality from './components/Login/LoginFunctionality';
import SettingsCardFunctionality from './components/SettingsCard/SettingsCardFunctionality';

// ProtectedRoute component to handle access control
const ProtectedRoute = ({ children, path }) => {
  const { user, hasAccess, userPrivileges } = React.useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!hasAccess(path) && path !== '/') {
    return <Navigate to="/" />;
  }
  if (user.role !== 'Admin' && Object.keys(userPrivileges).length === 0 && path !== '/') {
    return <Navigate to="/" />;
  }
  return children;
};

// Create a wrapper component to use useLocation
const AppContent = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/login';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#ff6f61] to-white bg-fixed">
      {showHeader && <HeaderFunctionality />}
      <Routes>
        <Route path="/login" element={<LoginFunctionality />} />
        <Route
          path="/"
          element={
            <ProtectedRoute path="/">
              <MainSectionFunctionality />
              <ButtonGroup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-manager"
          element={
            <ProtectedRoute path="/task-manager">
              <div className="p-4 text-center text-gray-800">Task Manager Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/testcase-generator"
          element={
            <ProtectedRoute path="/testcase-generator">
              <div className="p-4 text-center text-gray-800">Testcase Generator Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-report-generator"
          element={
            <ProtectedRoute path="/test-report-generator">
              <div className="p-4 text-center text-gray-800">Test Report Generator Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/status-mail-formatter"
          element={
            <ProtectedRoute path="/status-mail-formatter">
              <StatusMailFormatterFunctionality />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-manager"
          element={
            <ProtectedRoute path="/user-manager">
              <UserManagerFunctionality />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute path="/settings">
              <SettingsCardFunctionality />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;