import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

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
}) => {
  const [editingTestCase, setEditingTestCase] = useState(null);
  const [newTestCase, setNewTestCase] = useState('');
  const [newTestResult, setNewTestResult] = useState({ ticketId: '', type: '', status: '', priority: '' });
  const [newIssue, setNewIssue] = useState({ ticket: '', description: '' });

  if (!hasAccess('/test-report-generator')) {
    return <div className="p-4 text-gray-300 text-center">You do not have access to this page.</div>;
  }

  const handleEditTestCaseSubmit = () => {
    if (!newTestCase.trim()) {
      alert('Test case description is required.');
      return;
    }
    handleEditTestCase(editingTestCase.id, newTestCase);
    setEditingTestCase(null);
    setNewTestCase('');
  };

  const renderTextWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" class="text-blue-400">${url}</a>`);
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
          <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">QA Test Report</h2>

          {/* Project Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter project name"
                />
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
                  onChange={(e) => setTester(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Enter tester name"
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
                  <option value="" className="bg-gray-700 text-gray-200">Select Environment</option>
                  {environmentOptions.map((env) => (
                    <option key={env} value={env} className="bg-gray-700 text-gray-200">{env}</option>
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
                  <option value="" className="bg-gray-700 text-gray-200">Select Test Type</option>
                  {testTypeOptions.map((type) => (
                    <option key={type} value={type} className="bg-gray-700 text-gray-200">{type}</option>
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
                  <option value="" className="bg-gray-700 text-gray-200">Select Browser</option>
                  {browserOptions.map((br) => (
                    <option key={br} value={br} className="bg-gray-700 text-gray-200">{br}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'Completed', color: 'text-green-400' },
                    { value: 'In Progress', color: 'text-orange-400' },
                    { value: 'To Be Done', color: 'text-blue-400' },
                    { value: 'Blocked', color: 'text-red-400' },
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
                    alert('Test case description is required.');
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleCopyTestCase(testCase)}
                                      className="text-gray-400 hover:text-gray-300"
                                      title="Copy"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8" />
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
                  alert('Ticket ID is required.');
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
                            <option key={type} value={type} className="bg-gray-700 text-gray-200">{type}</option>
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
                            <option key={status} value={status} className="bg-gray-700 text-gray-200">{status}</option>
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
                            <option key={priority} value={priority} className="bg-gray-700 text-gray-200">{priority}</option>
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
                    alert('Ticket ID and description are required.');
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
              <span className={status === 'Completed' ? 'font-bold text-green-400' : 'font-bold text-red-400'}>
                {status === 'Completed' ? 'Passed' : 'Failed'}
              </span>.
            </p>
          </div>

          {/* Download and Upload Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium"
            >
              Download PDF
            </button>
            <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium cursor-pointer">
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUploadPDF}
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