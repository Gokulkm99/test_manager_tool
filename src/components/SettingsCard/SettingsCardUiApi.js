import React from 'react';

const SettingsCardUI = ({ settings, handleInputChange, handleSubmit, error, success }) => {
  return (
    <div className="p-4 bg-gray-800 text-gray-200 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1">Greeting</label>
          <input
            type="text"
            name="greeting"
            value={settings.greeting}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={settings.name}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={settings.mobile}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            value={settings.designation}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">To Emails</label>
          <input
            type="text"
            name="to_emails"
            value={settings.to_emails}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">CC Emails</label>
          <input
            type="text"
            name="cc_emails"
            value={settings.cc_emails}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Redmine API Key</label>
          <input
            type="text"
            name="redmine_api_key"
            value={settings.redmine_api_key}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="Enter your Redmine API key"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
      {error && <p className="mt-2 text-red-400">{error}</p>}
      {success && <p className="mt-2 text-green-400">{success}</p>}
    </div>
  );
};

export default SettingsCardUI;