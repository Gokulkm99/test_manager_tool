import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const QATestReportSettings = ({
  projects,
  browserOptions,
  environmentOptions,
  testTypeOptions,
  onClose,
  handleAddProject,
  handleDeleteProject,
  handleAddBrowser,
  handleDeleteBrowser,
  handleAddEnvironment,
  handleDeleteEnvironment,
  handleAddTestType,
  handleDeleteTestType,
}) => {
  const { user, hasAccess } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [newItem, setNewItem] = useState('');

  const [localProjects, setLocalProjects] = useState(projects || []);
  const [localBrowsers, setLocalBrowsers] = useState(browserOptions || []);
  const [localEnvironments, setLocalEnvironments] = useState(environmentOptions || []);
  const [localTestTypes, setLocalTestTypes] = useState(testTypeOptions || []);

  useEffect(() => {
    if (!user || !hasAccess('/test-report-generator')) {
      navigate('/');
      return;
    }
    setLocalProjects(projects || []);
    setLocalBrowsers(browserOptions || []);
    setLocalEnvironments(environmentOptions || []);
    setLocalTestTypes(testTypeOptions || []);
  }, [user, hasAccess, navigate, projects, browserOptions, environmentOptions, testTypeOptions]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    switch (activeTab) {
      case 'projects':
        handleAddProject(newItem);
        setLocalProjects([...localProjects, newItem]);
        break;
      case 'browsers':
        handleAddBrowser(newItem);
        setLocalBrowsers([...localBrowsers, newItem]);
        break;
      case 'environments':
        handleAddEnvironment(newItem);
        setLocalEnvironments([...localEnvironments, newItem]);
        break;
      case 'testTypes':
        handleAddTestType(newItem);
        setLocalTestTypes([...localTestTypes, newItem]);
        break;
      default:
        break;
    }
    setNewItem('');
  };

  const handleDeleteItem = (item, type) => {
    switch (type) {
      case 'projects':
        handleDeleteProject(item);
        setLocalProjects(localProjects.filter((p) => p !== item));
        break;
      case 'browsers':
        handleDeleteBrowser(item);
        setLocalBrowsers(localBrowsers.filter((b) => b !== item));
        break;
      case 'environments':
        handleDeleteEnvironment(item);
        setLocalEnvironments(localEnvironments.filter((e) => e !== item));
        break;
      case 'testTypes':
        handleDeleteTestType(item);
        setLocalTestTypes(localTestTypes.filter((t) => t !== item));
        break;
      default:
        break;
    }
  };

  const handleSaveSettings = () => {
    const updatedSettings = {
      projects: localProjects,
      browsers: localBrowsers,
      environments: localEnvironments,
      testTypes: localTestTypes,
    };
    onClose(updatedSettings);
  };

  const handleCancelSettings = () => {
    onClose(null);
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelSettings();
    }
  };

  const renderItemList = (items, type) => (
    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 border border-gray-600 rounded-md p-2 bg-gray-700">
      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">No {type} added.</p>
      ) : (
        items.map((item) => (
          <div key={item} className="flex items-center justify-between bg-gray-800 p-2 rounded-md mb-1">
            <span className="text-sm text-gray-200">{item}</span>
            <button
              onClick={() => handleDeleteItem(item, type)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleCloseModal}
    >
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Report Settings</h3>
        <div className="mb-4">
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder={`Add new ${activeTab.slice(0, -1)}`}
              className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
            />
            <button
              onClick={handleAddItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex space-x-2 mb-4">
            {['projects', 'browsers', 'environments', 'testTypes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1, -1)}
              </button>
            ))}
          </div>
          {activeTab === 'projects' && renderItemList(localProjects, 'projects')}
          {activeTab === 'browsers' && renderItemList(localBrowsers, 'browsers')}
          {activeTab === 'environments' && renderItemList(localEnvironments, 'environments')}
          {activeTab === 'testTypes' && renderItemList(localTestTypes, 'testTypes')}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancelSettings}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QATestReportSettings;