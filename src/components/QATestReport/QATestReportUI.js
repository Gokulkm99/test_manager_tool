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
  handleAddProject,
  handleDeleteProject,
  handleAddBrowser,
  handleDeleteBrowser,
  handleAddEnvironment,
  handleDeleteEnvironment,
  handleAddTestType,
  handleDeleteTestType,
  dateError,
}) => {
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [newTestCase, setNewTestCase] = useState('');
  const [newTestResult, setNewTestResult] = useState({ ticketId: '', type: '', status: '', priority: '' });
  const [newIssue, setNewIssue] = useState({ ticket: '', description: '', priority: '' });
  const [toast, setToast] = useState(null);
  const { user } = useContext(AuthContext);
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    projects: projects || [],
    browsers: browserOptions || [],
    environments: environmentOptions || [],
    testTypes: testTypeOptions || [],
  });

  useEffect(() => {
    setLocalSettings({
      projects: projects || [],
      browsers: browserOptions || [],
      environments: environmentOptions || [],
      testTypes: testTypeOptions || [],
    });
  }, [projects, browserOptions, environmentOptions, testTypeOptions]);

  useEffect(() => {
    if (user?.username) {
      setTester(user.username);
    }
  }, [user, setTester]);

  useEffect(() => {
    if (!summary && projectName) {
      setSummary(
        `The QA team tested ${projectName} to ensure its functionality, reliability, and performance. This report summarizes the test results and any issues encountered during testing.`
      );
    }
  }, [projectName, summary, setSummary]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSettingsClose = (updatedSettings) => {
    if (updatedSettings) {
      setLocalSettings(updatedSettings);
      refreshSettingsData(updatedSettings);
    }
    setShowSettings(false);
  };

  if (!hasAccess('/test-report-generator')) {
    return <div className="p-4 text-gray-100 text-center bg-gray-800">You do not have access to this page.</div>;
  }

  const handleEditTestCaseSubmit = () => {
    if (!newTestCase.trim()) {
      showToast('danger', 'Test case description is required.');
      return;
    }
    handleEditTestCase(editingTestCase.id, newTestCase);
    setEditingTestCase(null);
    setNewTestCase('');
    showToast('success', 'Test case updated.');
  };

  const renderTextWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          {part}
        </a>
      ) : (
        part
      )
    );
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

  const handleEndDateChange = (date) => {
    if (startDate && date && date < startDate) {
      showToast('danger', 'End Date cannot be earlier than Start Date.');
      return;
    }
    setEndDate(date);
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="header-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <div className="relative z-10 flex-1 p-4 mx-auto w-full">
        <div className="bg-gray-800 bg-opacity-90 rounded-lg p-4 animate-fadeIn max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
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
              className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-gray-800 rounded-lg shadow fixed top-4 right-4 z-50"
              role="alert"
            >
              <div
                className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-${
                  toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'
                }-400 bg-${
                  toast.type === 'success' ? 'green' : toast.type === 'danger' ? 'red' : 'orange'
                }-800 rounded-lg`}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
              <div className="ml-3 text-sm font-normal text-gray-100">{toast.message}</div>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-700 inline-flex items-center justify-center h-8 w-8"
                onClick={() => setToast(null)}
                aria-label="Close"
              >
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
              handleAddProject={handleAddProject}
              handleDeleteProject={handleDeleteProject}
              handleAddBrowser={handleAddBrowser}
              handleDeleteBrowser={handleDeleteBrowser}
              handleAddEnvironment={handleAddEnvironment}
              handleDeleteEnvironment={handleDeleteEnvironment}
              handleAddTestType={handleAddTestType}
              handleDeleteTestType={handleDeleteTestType}
            />
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <select
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Project</option>
                  {(localSettings.projects || []).map((proj) => (
                    <option key={proj} value={proj} className="bg-gray-700 text-gray-100">{proj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
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
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-500 text-sm cursor-not-allowed"
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
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Environment</option>
                  {(localSettings.environments || []).map((env) => (
                    <option key={env} value={env} className="bg-gray-700 text-sm">{env}</option>
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
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholderText=""
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date <span className="text-red-400">*</span>
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholderText=""
                  dateFormat="dd/MM/yyyy"
                />
                {dateError && <p className="text-red-400 text-xs mt-1">{dateError}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Test Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Test Type</option>
                  {(localSettings.testTypes || []).map((type) => (
                    <option key={type} value={type} className="bg-gray-700 text-sm">{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Change ID</label>
                <input
                  type="text"
                  value={changeId}
                  onChange={(e) => setChangeId(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter ticket ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Browser <span className="text-red-400">*</span>
                </label>
                <select
                  value={browser}
                  onChange={(e) => setBrowser(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Browser</option>
                  {(localSettings.browsers || []).map((b) => (
                    <option key={b} value={b} className="bg-gray-700 text-sm">{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status <span className="text-red-400">*</span>
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'Pass', color: 'text-green-400' },
                    { value: 'Fail', color: 'text-red-400' },
                    { value: 'Blocked', color: 'text-blue-400' },
                  ].map((item) => (
                    <label key={item.value} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={item.value}
                        checked={status === item.value}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`form-radio ${item.color} focus:ring-blue-500`}
                      />
                      <span className={`ml-2 text-sm ${item.color}`}>{item.value}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Summary</h3>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter summary..."
            />
          </div>

          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Test Cases</h3>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newTestCase}
                onChange={(e) => setNewTestCase(e.target.value)}
                placeholder="Enter test case description"
                className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-blue-500 text-sm"
              />
              {editingTestCase ? (
                <>
                  <button
                    onClick={handleEditTestCaseSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingTestCase(null);
                      setNewTestCase('');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (!newTestCase.trim()) {
                      showToast('danger', 'Test case description is required.');
                      return;
                    }
                    if (handleAddTestCase(newTestCase)) {
                      setNewTestCase('');
                      showToast('success', 'Test case added successfully.');
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Add
                </button>
              )}
            </div>
            <DragDropContext onDragEnd={handleReorderTestCases}>
              <Droppable droppableId="testCases">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {testCases.length === 0 ? (
                      <p className="text-gray-500 text-sm">No test cases added.</p>
                    ) : (
                      <ul className="space-y-2">
                        {testCases.map((testCase, index) => (
                          <Draggable key={testCase.id} draggableId={testCase.id} index={index}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center p-3 bg-gray-800 rounded-lg"
                              >
                                <svg
                                  className="w-5 h-5 text-gray-400 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 8h16M4 16h16"
                                  />
                                </svg>
                                <span className="flex-1 text-sm text-gray-100">{renderTextWithLinks(testCase.description)}</span>
                                <button
                                  onClick={() => {
                                    setEditingTestCase(testCase);
                                    setNewTestCase(testCase.description);
                                  }}
                                  className="text-blue-400 hover:text-blue-300 ml-2"
                                  title="Edit test case"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    handleCopyTestCase(testCase);
                                    showToast('success', 'Test case copied.');
                                  }}
                                  className="text-green-400 hover:text-green-300 ml-2"
                                  title="Copy test case"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5a2 2 0 002 2h4a2 2 0 002-2M8 5a2 2 0 012-2h4a2 2 0 012 2"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteTestCase(testCase.id);
                                    showToast('success', 'Test case deleted.');
                                  }}
                                  className="text-red-400 hover:text-red-300 ml-2"
                                  title="Delete test case"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Test Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ticket ID</label>
                <input
                  type="text"
                  value={newTestResult.ticketId}
                  onChange={(e) => setNewTestResult({ ...newTestResult, ticketId: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter ticket ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select
                  value={newTestResult.type}
                  onChange={(e) => setNewTestResult({ ...newTestResult, type: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Type</option>
                  {testResultTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-700 text-gray-100">{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={newTestResult.status}
                  onChange={(e) => setNewTestResult({ ...newTestResult, status: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Status</option>
                  {testResultStatuses.map((status) => (
                    <option key={status} value={status} className="bg-gray-700 text-gray-100">{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                <select
                  value={newTestResult.priority}
                  onChange={(e) => setNewTestResult({ ...newTestResult, priority: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Priority</option>
                  {testResultPriorities.map((priority) => (
                    <option key={priority} value={priority} className="bg-gray-700 text-gray-100">{priority}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (!newTestResult.ticketId || !newTestResult.type || !newTestResult.status || !newTestResult.priority) {
                  showToast('danger', 'All fields are required.');
                  return;
                }
                if (handleAddTestResult(newTestResult)) {
                  setNewTestResult({ ticketId: '', type: '', status: '', priority: '' });
                  showToast('success', 'Test result added successfully.');
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Add Test Result
            </button>
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-sm mt-4">No test results found.</p>
            ) : (
              <table className="w-full mt-4 border-t border-gray-600">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 text-left text-sm text-gray-100">Ticket ID</th>
                    <th className="p-2 text-left text-sm text-gray-100">Type</th>
                    <th className="p-2 text-left text-sm text-gray-100">Status</th>
                    <th className="p-2 text-left text-sm text-gray-100">Priority</th>
                    <th className="p-2 text-left text-sm text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result) => (
                    <tr key={result.id} className="border-b border-gray-600">
                      <td className="p-2 text-sm text-gray-100">{result.ticketId}</td>
                      <td className="p-2 text-sm text-gray-100">{result.type}</td>
                      <td
                        className={`p-2 text-sm ${
                          result.status === 'Pass'
                            ? 'text-green-400'
                            : result.status === 'Fail'
                            ? 'text-red-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {result.status}
                      </td>
                      <td
                        className={`p-2 text-sm ${
                          result.priority === 'High'
                            ? 'text-red-400'
                            : result.priority === 'Medium'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}
                      >
                        {result.priority}
                      </td>
                      <td className="p-2 text-sm">
                        <button
                          onClick={() => {
                            handleDeleteTestResult(result.id);
                            showToast('success', 'Test result deleted.');
                          }}
                          className="text-red-400 hover:text-red-300"
                          title="Delete test result"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Issues Identified</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ticket</label>
                <input
                  type="text"
                  value={newIssue.ticket}
                  onChange={(e) => setNewIssue({ ...newIssue, ticket: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter ticket ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter issue description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                <select
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-100">Select Priority</option>
                  {testResultPriorities.map((priority) => (
                    <option key={priority} value={priority} className="bg-gray-700 text-gray-100">{priority}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (!newIssue.ticket || !newIssue.description || !newIssue.priority) {
                  showToast('danger', 'All fields are required.');
                  return;
                }
                if (handleAddIssue(newIssue)) {
                  setNewIssue({ ticket: '', description: '', priority: '' });
                  showToast('success', 'Issue added successfully.');
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
              Add Issue
            </button>
            {issues.length === 0 ? (
              <p className="text-gray-500 text-sm mt-4">No issues found.</p>
            ) : (
              <table className="w-full mt-4 border-t border-gray-600">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="p-2 text-left text-sm text-gray-100">Ticket</th>
                    <th className="p-2 text-left text-sm text-gray-100">Description</th>
                    <th className="p-2 text-left text-sm text-gray-100">Priority</th>
                    <th className="p-2 text-left text-sm text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id} className="border-b border-gray-600">
                      <td className="p-2 text-sm text-gray-100">{issue.ticket}</td>
                      <td className="p-2 text-sm text-gray-100">{renderTextWithLinks(issue.description)}</td>
                      <td
                        className={`p-2 text-sm ${
                          issue.priority === 'High'
                            ? 'text-red-400'
                            : issue.priority === 'Medium'
                            ? 'text-yellow-400'
                            : 'text-green-400'
                        }`}
                      >
                        {issue.priority}
                      </td>
                      <td className="p-2 text-sm">
                        <button
                          onClick={() => {
                            handleDeleteIssue(issue.id);
                            showToast('success', 'Issue deleted.');
                          }}
                          className="text-red-400 hover:text-red-300"
                          title="Delete issue"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter notes..."
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Recommendations</h3>
            <textarea
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter recommendations..."
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Conclusion</h3>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-100 focus:ring-1 focus:ring-blue-500 text-sm"
              rows="4"
              placeholder="Enter conclusion..."
            />
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm text-gray-300">
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadPDF}
                className="ml-2 text-sm text-gray-100"
              />
            </label>
            <button
              onClick={() => {
                if (validateFields()) {
                  handleDownloadPDF();
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QATestReportUI;