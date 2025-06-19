import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const DashboardUI = ({
  activeTab,
  setActiveTab,
  tickets,
  loading,
  error,
  selectedTickets,
  handleSelectTicket,
  hasAccess,
}) => {
  if (!hasAccess('/dashboard')) {
    return <div className="p-4 text-gray-100 text-center bg-gray-800">You do not have access to this page.</div>;
  }

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
            <h2 className="text-2xl font-bold text-gray-100 text-center">Dashboard</h2>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-600">
              {['ACHIEVE', 'JIRA', 'COMMON'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 text-sm font-medium ${
                    activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'ACHIEVE' && (
            <div>
              {loading && <p className="text-gray-100">Loading tickets...</p>}
              {error && (
                <div className="flex items-center p-4 mb-4 text-red-400 bg-gray-800 rounded-lg">
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              {!loading && !error && tickets.length === 0 && (
                <p className="text-gray-500 text-sm">No tickets found.</p>
              )}
              {!loading && !error && tickets.length > 0 && (
                <table className="w-full border-t border-gray-600">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-2 text-left text-sm text-gray-100">#</th>
                      <th className="p-2 text-left text-sm text-gray-100">Select</th>
                      <th className="p-2 text-left text-sm text-gray-100">Project</th>
                      <th className="p-2 text-left text-sm text-gray-100">Tracker</th>
                      <th className="p-2 text-left text-sm text-gray-100">Status</th>
                      <th className="p-2 text-left text-sm text-gray-100">Priority</th>
                      <th className="p-2 text-left text-sm text-gray-100">Subject</th>
                      <th className="p-2 text-left text-sm text-gray-100">Assignee</th>
                      <th className="p-2 text-left text-sm text-gray-100">Due Date</th>
                      <th className="p-2 text-left text-sm text-gray-100">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <tr key={ticket.id} className="border-b border-gray-600 hover:bg-gray-700">
                        <td className="p-2 text-sm text-gray-100">{index + 1}</td>
                        <td className="p-2 text-sm text-gray-100">
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => handleSelectTicket(ticket.id)}
                            className="form-checkbox text-blue-500"
                          />
                        </td>
                        <td className="p-2 text-sm text-gray-100">{ticket.project?.name || 'N/A'}</td>
                        <td className="p-2 text-sm text-gray-100">{ticket.tracker?.name || 'N/A'}</td>
                        <td className="p-2 text-sm text-gray-100">{ticket.status?.name || 'N/A'}</td>
                        <td className="p-2 text-sm text-gray-100">{ticket.priority?.name || 'N/A'}</td>
                        <td className="p-2 text-sm text-gray-100">{ticket.subject || 'N/A'}</td>
                        <td className="p-2 text-sm text-gray-100">{ticket.assigned_to?.name || 'N/A'}</td>
                        <td className="p-2 text-sm text-gray-100">{ticket.due_date || 'N/A'}</td>
                        <td className="p-2 text-sm text-gray-100">
                          {ticket.updated_on ? new Date(ticket.updated_on).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'JIRA' && (
            <div className="p-4 text-gray-100">
              <p>JIRA Tickets (Placeholder - No data source provided)</p>
            </div>
          )}

          {activeTab === 'COMMON' && (
            <div className="p-4 text-gray-100">
              <p>Common Tickets (Placeholder - No data source provided)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;