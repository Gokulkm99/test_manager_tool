import React, { useState } from 'react';
import useQATestReportFunctionality from './QATestReportFunctionality';

const QATestReportSettings = ({ projects, browserOptions, environmentOptions, testTypeOptions, onClose }) => {
  const {
    handleAddProject,
    handleDeleteProject,
    handleAddBrowser,
    handleDeleteBrowser,
    handleAddEnvironment,
    handleDeleteEnvironment,
    handleAddTestType,
    handleDeleteTestType,
  } = useQATestReportFunctionality();

  const [newProject, setNewProject] = useState('');
  const [newBrowser, setNewBrowser] = useState('');
  const [newEnvironment, setNewEnvironment] = useState('');
  const [newTestType, setNewTestType] = useState('');
  const [toast, setToast] = useState(null);
  const [tempSettings, setTempSettings] = useState({
    projects: projects || [],
    browsers: browserOptions || [],
    environments: environmentOptions || [],
    testTypes: testTypeOptions || [],
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async (type, value, handler) => {
    if (!value.trim()) {
      showToast('danger', `${type} name is required.`);
      return;
    }
    try {
      await handler(value);
      showToast('success', `${type} added successfully.`);
      let updatedSettings = { ...tempSettings };
      if (type === 'Project') {
        updatedSettings.projects = [...tempSettings.projects, value];
        setNewProject('');
      }
      if (type === 'Browser') {
        updatedSettings.browsers = [...tempSettings.browsers, value];
        setNewBrowser('');
      }
      if (type === 'Environment') {
        updatedSettings.environments = [...tempSettings.environments, value];
        setNewEnvironment('');
      }
      if (type === 'Test Type') {
        updatedSettings.testTypes = [...tempSettings.testTypes, value];
        setNewTestType('');
      }
      setTempSettings(updatedSettings);
    } catch (err) {
      showToast('danger', `Failed to add ${type.toLowerCase()}.`);
    }
  };

  const handleDelete = async (type, value, handler) => {
    try {
      await handler(value);
      showToast('success', `${type} deleted successfully.`);
      let updatedSettings = { ...tempSettings };
      if (type === 'Project') updatedSettings.projects = tempSettings.projects.filter(p => p !== value);
      if (type === 'Browser') updatedSettings.browsers = tempSettings.browsers.filter(b => b !== value);
      if (type === 'Environment') updatedSettings.environments = tempSettings.environments.filter(e => e !== value);
      if (type === 'Test Type') updatedSettings.testTypes = tempSettings.testTypes.filter(t => t !== value);
      setTempSettings(updatedSettings);
    } catch (err) {
      showToast('danger', `Failed to delete ${type.toLowerCase()}.`);
    }
  };

  const handleSave = () => {
    onClose(tempSettings);
  };

  const handleCancel = () => {
    onClose({ projects, browsers: browserOptions, environments: environmentOptions, testTypes: testTypeOptions });
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">QA Test Report Settings</h2>
          <button onClick={handleCancel} className="text-gray-300 hover:text-gray-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body with Scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {toast && (
            <div
              id={`toast-${toast.type}`}
              className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
              role="alert"
            >
              <div
                className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-${
                  toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'
                }-500 bg-${toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'}-100 rounded-lg dark:bg-${
                  toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'
                }-800 dark:text-${toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'}-200`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  {toast.type === 'success' && (
                    <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm3.293 6.293a1 1 0 0 1-1.414 1.414L10 11.414l-1.879 1.879a1 1 0 0 1-1.414-1.414L8.586 10 6.707 8.121a1 1 0 0 1 1.414-1.414L10 8.586l1.879-1.879a1 1 0 0 1 1.414 1.414z" />
                  )}
                  {toast.type === 'danger' && (
                    <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm3.293 11.293a1 1 0 0 1-1.414 0L10 11.414l-1.879 1.879a1 1 0 0 1-1.414-1.414L8.586 10 6.707 8.121a1 1 0 0 1 1.414-1.414L10 8.586l1.879-1.879a1 1 0 0 1 1.414 1.414L11.414 10l1.879 1.879a1 1 0 0 1 0 1.414z" />
                  )}
                  {toast.type === 'warning' && (
                    <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4a1 1 0 0 1-1-1V6a1 1 0 0 1 2 0v3a1 1 0 0 1-1 1z" />
                  )}
                </svg>
                <span className="sr-only">{toast.type === 'success' ? 'Check' : toast.type === 'danger' ? 'Error' : 'Warning'} icon</span>
              </div>
              <div className="ml-3 text-sm font-normal">{toast.message}</div>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => setToast(null)}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </button>
            </div>
          )}

          {/* Projects */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Projects</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                placeholder="Enter new project"
              />
              <button
                onClick={() => handleAdd('Project', newProject, handleAddProject)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Add
              </button>
            </div>
            {(tempSettings.projects || []).length > 0 && (
              <ul className="space-y-2 max-h-36 overflow-y-auto border border-gray-600 rounded-md p-2">
                {(tempSettings.projects || []).map((project) => (
                  <li key={project} className="flex justify-between items-center text-gray-200">
                    <span>{project}</span>
                    <button
                      onClick={() => handleDelete('Project', project, handleDeleteProject)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Browsers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Browsers</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newBrowser}
                onChange={(e) => setNewBrowser(e.target.value)}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                placeholder="Enter new browser"
              />
              <button
                onClick={() => handleAdd('Browser', newBrowser, handleAddBrowser)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Add
              </button>
            </div>
            {(tempSettings.browsers || []).length > 0 && (
              <ul className="space-y-2 max-h-36 overflow-y-auto border border-gray-600 rounded-md p-2">
                {(tempSettings.browsers || []).map((browser) => (
                  <li key={browser} className="flex justify-between items-center text-gray-200">
                    <span>{browser}</span>
                    <button
                      onClick={() => handleDelete('Browser', browser, handleDeleteBrowser)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Environments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Environments</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newEnvironment}
                onChange={(e) => setNewEnvironment(e.target.value)}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                placeholder="Enter new environment"
              />
              <button
                onClick={() => handleAdd('Environment', newEnvironment, handleAddEnvironment)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Add
              </button>
            </div>
            {(tempSettings.environments || []).length > 0 && (
              <ul className="space-y-2 max-h-36 overflow-y-auto border border-gray-600 rounded-md p-2">
                {(tempSettings.environments || []).map((environment) => (
                  <li key={environment} className="flex justify-between items-center text-gray-200">
                    <span>{environment}</span>
                    <button
                      onClick={() => handleDelete('Environment', environment, handleDeleteEnvironment)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Test Types */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Test Types</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTestType}
                onChange={(e) => setNewTestType(e.target.value)}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                placeholder="Enter new test type"
              />
              <button
                onClick={() => handleAdd('Test Type', newTestType, handleAddTestType)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Add
              </button>
            </div>
            {(tempSettings.testTypes || []).length > 0 && (
              <ul className="space-y-2 max-h-36 overflow-y-auto border border-gray-600 rounded-md p-2">
                {(tempSettings.testTypes || []).map((testType) => (
                  <li key={testType} className="flex justify-between items-center text-gray-200">
                    <span>{testType}</span>
                    <button
                      onClick={() => handleDelete('Test Type', testType, handleDeleteTestType)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
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