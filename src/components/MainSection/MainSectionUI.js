import React from 'react';

const MainSectionUI = ({ handleDashboard }) => {
  return (
    <div className="p-5 text-center animate-fadeIn bg-transparent">
      <h1 className="text-3xl text-white font-bold mb-2">Welcome to Caparizon</h1>
      <p className="text-lg text-gray-100 mb-4">
        This is the homepage of the GM Tools application. Use the navigation above to access different tools.
      </p>
      <button
        onClick={handleDashboard}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default MainSectionUI;