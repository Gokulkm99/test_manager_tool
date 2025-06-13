import React, { useState, useContext, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { AuthContext } from '../../AuthContext';
import QATestReportSettings from './QATestReportSettings';

const QATestReportUI = ({
  hasAccess,
  projectName,
  setProjectName,
  version,
  setVersion,
  tester,
  setTester,
  environment,
  setEnvironment,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  testType,
  setTestType,
  changeId,
  setChangeId,
  browser,
  setBrowser,
  status,
  setStatus,
  summary,
  setSummary,
  testCases,
  setTestCases,
  testResults,
  setTestResults,
  issues,
  setIssues,
  notes,
  setNotes,
  recommendations,
  setRecommendations,
  conclusion,
  setConclusion,
  handleAddTestCase,
  handleEditTestCase,
  handleDeleteTestCase,
  handleCopyTestCase,
  handleReorderTestCases,
  handleAddTestResult,
  handleDeleteTestResult,
  handleAddIssue,
  handleDeleteIssue,
  handleDownloadPDF,
  handleUploadPDF,
  environmentOptions,
  testTypeOptions,
  browserOptions,
  testResultTypes,
  testResultStatuses,
  testResultPriorities,
  projects,
  refreshSettingsData,
}) => {
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [newTestCase, setNewTestCase] = useState('');
  const [newTestResult, setNewTestResult] = useState({ ticketId: '', type: '', status: '', priority: '' });
  const [newIssue, setNewIssue] = useState({ ticket: '', description: '' });
  const [toast, setToast] = useState(null);
  const { user } = useContext(AuthContext);
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    projects: projects || [],
    browsers: browserOptions || [],
    environments: environmentOptions || [],
    testTypes: testTypeOptions || [],
  });

  // Sync localSettings with props
  useEffect(() => {
    setLocalSettings({
      projects: projects || [],
      browsers: browserOptions || [],
      environments: environmentOptions || [],
      testTypes: testTypeOptions || [],
    });
  }, [projects, browserOptions, environmentOptions, testTypeOptions]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Set default summary when projectName changes
  useEffect(() => {
    if (!summary && projectName) {
      setSummary(
        `The QA team tested ${projectName} to ensure its functionality, reliability, and performance. This report summarizes the test results and any issues encountered during testing.`
      );
    }
  }, [projectName, summary, setSummary]);

  const handleSettingsClose = (updatedSettings) => {
    if (updatedSettings) {
      setLocalSettings(updatedSettings);
      refreshSettingsData(updatedSettings);
    }
    setShowSettings(false);
  };

  if (!hasAccess('/test-report-generator')) {
    return <div className="p-4 text-gray-300 text-center">You do not have access to this page.</div>;
  }

  const handleEditTestCaseSubmit = () => {
    if (!newTestCase.trim()) {
      showToast('danger', 'Test case description is required.');
      return;
    }
    handleEditTestCase(editingTestCase.id, newTestCase);
    setEditingTestCase(null);
    setNewTestCase('');
  };

  const renderTextWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" className="text-blue-400">${url}</a>`);
  };

  const validateFields = () => {
    if (!projectName) {
      showToast('danger', 'Project Name is required.');
      return false;
    }
    if (!tester) {
      showToast('danger', 'Tester is required.');
      return false;
    }
    if (!environment) {
      showToast('danger', 'Environment is required.');
      return false;
    }
    if (!startDate) {
      showToast('danger', 'Start Date is required.');
      return false;
    }
    if (!endDate) {
      showToast('danger', 'End Date is required.');
      return false;
    }
    if (!testType) {
      showToast('danger', 'Test Type is required.');
      return false;
    }
    if (!browser) {
      showToast('danger', 'Browser is required.');
      return false;
    }
    if (!status) {
      showToast('danger', 'Status is required.');
      return false;
    }
    return true;
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-900">
      <div className="header-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="relative z-10 flex-1 p-4 mx-auto w-full max-w-6xl">
        <div className="bg-gray-800 bg-opacity-90 rounded-lg p-6 animate-fadeIn max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100 text-center">QA Test Report</h2>
            {user?.role === 'Admin' && (
              <button
                onClick={() => setShowSettings(true)}
                className="text-gray-300 hover:text-gray-100"
                title="Settings"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          {toast && (
            <div
              id={`toast-${toast.type}`}
              className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 fixed top-4 right-4 z-50"
              role="alert"
            >
              <div
                className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-${
                  toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'
                }-500 bg-${toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'}-100 rounded-lg dark:bg-${
                  toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'
                }-800 dark:text-${toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'}-200`}
              >
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  {toast.type === 'success' && (
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  )}
                  {toast.type === 'danger' && (
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                  )}
                  {toast.type === 'warning' && (
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
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
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
              </button>
            </div>
          )}

          {showSettings && user?.role === 'Admin' && (
            <QATestReportSettings
              projects={localSettings.projects}
              browserOptions={localSettings.browsers}
              environmentOptions={localSettings.environments}
              testTypeOptions={localSettings.testTypes}
              onClose={handleSettingsClose}
            />
          )}

          {/* Project Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <select
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-200">
                    Select Project
                  </option>
                  {(localSettings.projects || []).map((proj) => (
                    <option key={proj} value={proj} className="bg-gray-700 text-gray-200">
                      {proj}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter version"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tester <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={tester}
                  readOnly
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm opacity-50 cursor-not-allowed"
                  placeholder="Tester name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Environment <span className="text-red-400">*</span>
                </label>
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-200">
                    Select Environment
                  </option>
                  {(localSettings.environments || []).map((env) => (
                    <option key={env} value={env} className="bg-gray-700 text-gray-200">
                      {env}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholderText="Select start date"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date <span className="text-red-400">*</span>
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholderText="Select end date"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type of Test <span className="text-red-400">*</span>
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-200">
                    Select Test Type
                  </option>
                  {(localSettings.testTypes || []).map((type) => (
                    <option key={type} value={type} className="bg-gray-700 text-gray-200">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Change ID</label>
                <input
                  type="text"
                  value={changeId}
                  onChange={(e) => setChangeId(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter change ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Browser <span className="text-red-400">*</span>
                </label>
                <select
                  value={browser}
                  onChange={(e) => setBrowser(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-200">
                    Select Browser
                  </option>
                  {(localSettings.browsers || []).map((br) => (
                    <option key={br} value={br} className="bg-gray-700 text-gray-200">
                      {br}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'Pass', color: 'text-green-400' },
                    { value: 'Fail', color: 'text-red-400' },
                  ].map((stat) => (
                    <label key={stat.value} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={stat.value}
                        checked={status === stat.value}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`form-radio ${stat.color} focus:ring-${stat.color.split('-')[1]}-500 w-4 h-4`}
                      />
                      <span className={`text-sm ${stat.color}`}>{stat.value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Summary</h3>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter summary"
            />
          </div>

          {/* Test Cases */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Test Cases</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTestCase}
                onChange={(e) => setNewTestCase(e.target.value)}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Enter new test case"
              />
              <button
                onClick={() => {
                  if (!newTestCase.trim()) {
                    showToast('danger', 'Test case description is required.');
                    return;
                  }
                  editingTestCase ? handleEditTestCaseSubmit() : handleAddTestCase(newTestCase);
                  setNewTestCase('');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                {editingTestCase ? 'Save Edit' : 'Add Test Case'}
              </button>
              {editingTestCase && (
                <button
                  onClick={() => {
                    setEditingTestCase(null);
                    setNewTestCase('');
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
            {testCases.length === 0 ? (
              <p className="text-gray-400 text-center text-sm">No test cases added.</p>
            ) : (
              <DragDropContext onDragEnd={handleReorderTestCases}>
                <Droppable droppableId="testCases">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex flex-col gap-2 ${snapshot.isDraggingOver ? 'bg-gray-600' : ''}`}
                    >
                      <table className="w-full text-sm text-gray-200">
                        <thead>
                          <tr className="bg-gray-700">
                            <th className="p-2 text-left">No</th>
                            <th className="p-2 text-left">Test Case</th>
                            <th className="p-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testCases.map((testCase, index) => (
                            <Draggable key={testCase.id} draggableId={testCase.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`border-b border-gray-600 ${snapshot.isDragging ? 'bg-gray-500' : 'bg-gray-800'}`}
                                >
                                  <td className="p-2">{index + 1}</td>
                                  <td className="p-2">{testCase.description}</td>
                                  <td className="p-2 text-right flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingTestCase(testCase);
                                        setNewTestCase(testCase.description);
                                      }}
                                      className="text-blue-400 hover:text-blue-300"
                                      title="Edit"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleCopyTestCase(testCase)}
                                      className="text-gray-400 hover:text-gray-300"
                                      title="Copy"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTestCase(testCase.id)}
                                      className="text-red-400 hover:text-red-300"
                                      title="Delete"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                        </tbody>
                      </table>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Test Results */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Test Results</h3>
            <button
              onClick={() => {
                if (!newTestResult.ticketId.trim()) {
                  showToast('danger', 'Ticket ID is required.');
                  return;
                }
                handleAddTestResult({
                  ticketId: newTestResult.ticketId,
                  type: newTestResult.type || testResultTypes[0],
                  status: newTestResult.status || testResultStatuses[0],
                  priority: newTestResult.priority || testResultPriorities[0],
                });
                setNewTestResult({ ticketId: '', type: '', status: '', priority: '' });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium mb-4"
            >
              Add Test Result
            </button>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newTestResult.ticketId}
                onChange={(e) => setNewTestResult({ ...newTestResult, ticketId: e.target.value })}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Enter ticket ID"
              />
            </div>
            {testResults.length === 0 ? (
              <p className="text-gray-400 text-center text-sm">No test results added.</p>
            ) : (
              <table className="w-full text-sm text-gray-200">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-2 text-left">No</th>
                    <th className="p-2 text-left">Ticket ID</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Priority</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={result.id} className="border-b border-gray-600 bg-gray-800">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={result.ticketId}
                          onChange={(e) => {
                            const updatedResults = [...testResults];
                            updatedResults[index].ticketId = e.target.value;
                            setTestResults(updatedResults);
                          }}
                          className="w-full p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={result.type}
                          onChange={(e) => {
                            const updatedResults = [...testResults];
                            updatedResults[index].type = e.target.value;
                            setTestResults(updatedResults);
                          }}
                          className="w-full p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                        >
                          {testResultTypes.map((type) => (
                            <option key={type} value={type} className="bg-gray-700 text-gray-200">
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={result.status}
                          onChange={(e) => {
                            const updatedResults = [...testResults];
                            updatedResults[index].status = e.target.value;
                            setTestResults(updatedResults);
                          }}
                          className="w-full p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                        >
                          {testResultStatuses.map((status) => (
                            <option key={status} value={status} className="bg-gray-700 text-gray-200">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          value={result.priority}
                          onChange={(e) => {
                            const updatedResults = [...testResults];
                            updatedResults[index].priority = e.target.value;
                            setTestResults(updatedResults);
                          }}
                          className="w-full p-1 border border-gray-600 rounded-md bg-gray-700 text-gray-200 text-sm"
                        >
                          {testResultPriorities.map((priority) => (
                            <option key={priority} value={priority} className="bg-gray-700 text-gray-200">
                              {priority}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 text-right">
                        <button
                          onClick={() => handleDeleteTestResult(result.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Issues Identified */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Issues Identified</h3>
            <div className="flex gap-2 mb-4 flex-wrap">
              <input
                type="text"
                value={newIssue.ticket}
                onChange={(e) => setNewIssue({ ...newIssue, ticket: e.target.value })}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Enter ticket ID"
              />
              <input
                type="text"
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                placeholder="Enter issue description"
              />
              <button
                onClick={() => {
                  if (!newIssue.ticket.trim() || !newIssue.description.trim()) {
                    showToast('danger', 'Ticket ID and description are required.');
                    return;
                  }
                  handleAddIssue(newIssue);
                  setNewIssue({ ticket: '', description: '' });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Add Issue
              </button>
            </div>
            {issues.length === 0 ? (
              <p className="text-gray-400 text-center text-sm">No issues added.</p>
            ) : (
              <table className="w-full text-sm text-gray-200">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-2 text-left">No</th>
                    <th className="p-2 text-left">Ticket</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue, index) => (
                    <tr key={issue.id} className="border-b border-gray-600 bg-gray-800">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{issue.ticket}</td>
                      <td className="p-2" dangerouslySetInnerHTML={{ __html: renderTextWithLinks(issue.description) }} />
                      <td className="p-2 text-right">
                        <button
                          onClick={() => handleDeleteIssue(issue.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter notes"
            />
          </div>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Recommendations</h3>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter recommendations"
            />
          </div>

          {/* Conclusion */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Conclusion</h3>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter conclusion"
            />
            <p className="text-sm text-gray-300 mt-2">
              The Testing has been completed and it is{' '}
              <span className={status === 'Pass' ? 'font-bold text-green-400' : 'font-bold text-red-400'}>{status}</span>.
            </p>
          </div>

          {/* Download and Upload Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (validateFields()) {
                  handleDownloadPDF();
                  showToast('success', 'PDF downloaded successfully.');
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Download PDF
            </button>
            <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium cursor-pointer">
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  handleUploadPDF(e);
                  showToast('success', 'PDF uploaded successfully.');
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QATestReportUI;