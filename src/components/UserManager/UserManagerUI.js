import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const UserManagerUI = ({
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
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSavePrivilegesModal, setShowSavePrivilegesModal] = useState(false);

  if (!hasAccess('/user-manager') || user?.role !== 'Admin') {
    return <div className="p-4 text-gray-100 text-center bg-gray-800">You do not have access to this page.</div>;
  }

  // Filter users based on search query
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete confirmation
  const confirmDelete = () => {
    handleDeleteUser();
    setShowDeleteModal(false);
  };

  // Handle save privileges confirmation
  const confirmSavePrivileges = () => {
    handleSavePrivileges();
    setShowSavePrivilegesModal(false);
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
            <h2 className="text-2xl font-bold text-gray-100 text-center">User Manager</h2>
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
                {toast.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
                {toast.type === 'danger' && <XCircleIcon className="w-5 h-5" />}
                {toast.type === 'warning' && <ExclamationCircleIcon className="w-5 h-5" />}
                <span className="sr-only">{toast.type} icon</span>
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

          <div className="mb-6">
            <div className="flex space-x-4 border-b border-gray-600">
              <button
                className={`pb-2 text-sm font-medium ${
                  activeTab === 'details' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-gray-100'
                }`}
                onClick={() => setActiveTab('details')}
              >
                User Details
              </button>
              <button
                className={`pb-2 text-sm font-medium ${
                  activeTab === 'privileges' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-300 hover:text-gray-100'
                }`}
                onClick={() => setActiveTab('privileges')}
              >
                User Privileges
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            {/* Left Panel: User List */}
            <div className="w-1/2">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Users</h3>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-sm">No users found.</p>
              ) : (
                <table className="w-full border-t border-gray-600">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-2 text-left text-sm text-gray-100">#</th>
                      <th className="p-2 text-left text-sm text-gray-100">Username</th>
                      <th className="p-2 text-left text-sm text-gray-100">Email</th>
                      <th className="p-2 text-left text-sm text-gray-100">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, index) => (
                      <tr
                        key={u.id}
                        className={`border-b border-gray-600 cursor-pointer hover:bg-gray-700 ${
                          selectedUser?.id === u.id ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => handleSelectUser(u)}
                      >
                        <td className="p-2 text-sm text-gray-100">{index + 1}</td>
                        <td className="p-2 text-sm text-gray-100">{u.username}</td>
                        <td className="p-2 text-sm text-gray-100">{u.email}</td>
                        <td className="p-2 text-sm text-gray-100">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Right Panel: Selected User Details/Privileges */}
            <div className="w-1/2">
              {selectedUser ? (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">
                    {activeTab === 'details' ? 'User Details' : 'User Privileges'} - {selectedUser.username}
                  </h3>

                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Username</label>
                        <input
                          type="text"
                          value={selectedUser.username}
                          readOnly
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                          type="text"
                          value={selectedUser.email}
                          readOnly
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Designation</label>
                        <input
                          type="text"
                          value={selectedUser.designation || 'N/A'}
                          readOnly
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Role</label>
                        <input
                          type="text"
                          value={selectedUser.role}
                          readOnly
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Employee ID</label>
                        <input
                          type="text"
                          value={selectedUser.employee_id || 'N/A'}
                          readOnly
                          className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-gray-100 text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'privileges' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Access Permissions</label>
                        {availablePermissions.map((permission) => (
                          <div key={permission} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={privileges.includes(permission)}
                              onChange={() => handlePrivilegeChange(permission)}
                              className="form-checkbox text-blue-500 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-100">{permission}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowSavePrivilegesModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center"
                        >
                          <PencilIcon className="w-4 h-4 mr-2" />
                          Save Privileges
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm flex items-center"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete User
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select a user to view details or privileges.</p>
              )}
            </div>
          </div>

          {/* Delete User Modal */}
          {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 z-[80] min-h-full overflow-y-auto overflow-x-hidden transition flex items-center"> {/* Update z-index */}
              {/* Overlay */}
              <div
                aria-hidden="true"
                className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              ></div>

              {/* Modal */}
              <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
                <div className="w-full py-2 bg-white cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                  <button
                    type="button"
                    className="absolute top-2 right-2 rtl:right-auto rtl:left-2"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    <svg
                      title="Close"
                      className="h-4 w-4 cursor-pointer text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Close</span>
                  </button>

                  <div className="space-y-2 p-2">
                    <div className="p-4 space-y-2 text-center dark:text-white">
                      <h2 className="text-xl font-bold tracking-tight" id="page-action.heading">
                        Delete {selectedUser.username}
                      </h2>
                      <p className="text-gray-500">Are you sure you would like to do this?</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div aria-hidden="true" className="border-t dark:border-gray-700 px-2"></div>
                    <div className="px-6 py-2">
                      <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800"
                          onClick={() => setShowDeleteModal(false)}
                        >
                          <span className="flex items-center gap-1">
                            <span>Cancel</span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:ring-offset-red-700"
                          onClick={confirmDelete}
                        >
                          <span className="flex items-center gap-1">
                            <span>Confirm</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Privileges Modal */}
          {showSavePrivilegesModal && selectedUser && (
            <div className="fixed inset-0 z-[80] min-h-full overflow-y-auto overflow-x-hidden transition flex items-center"> {/* Update z-index */}
              {/* Overlay */}
              <div
                aria-hidden="true"
                className="fixed inset-0 w-full h-full bg-black/50 cursor-pointer"
                onClick={() => setShowSavePrivilegesModal(false)}
              ></div>

              {/* Modal */}
              <div className="relative w-full cursor-pointer pointer-events-none transition my-auto p-4">
                <div className="w-full py-2 bg-white cursor-default pointer-events-auto dark:bg-gray-800 relative rounded-xl mx-auto max-w-sm">
                  <button
                    type="button"
                    className="absolute top-2 right-2 rtl:right-auto rtl:left-2"
                    onClick={() => setShowSavePrivilegesModal(false)}
                  >
                    <svg
                      title="Close"
                      className="h-4 w-4 cursor-pointer text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Close</span>
                  </button>

                  <div className="space-y-2 p-2">
                    <div className="p-4 space-y-2 text-center dark:text-white">
                      <h2 className="text-xl font-bold tracking-tight" id="page-action.heading">
                        Save Privileges for {selectedUser.username}
                      </h2>
                      <p className="text-gray-500">Are you sure you want to update this user’s privileges?</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div aria-hidden="true" className="border-t dark:border-gray-700 px-2"></div>
                    <div className="px-6 py-2">
                      <div className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-gray-800 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:border-primary-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200 dark:focus:text-primary-400 dark:focus:border-primary-400 dark:focus:bg-gray-800"
                          onClick={() => setShowSavePrivilegesModal(false)}
                        >
                          <span className="flex items-center gap-1">
                            <span>Cancel</span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center py-1 gap-1 font-medium rounded-lg border transition-colors outline-none focus:ring-offset-2 focus:ring-2 focus:ring-inset dark:focus:ring-offset-0 min-h-[2.25rem] px-4 text-sm text-white shadow focus:ring-white border-transparent bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 focus:ring-offset-blue-700"
                          onClick={confirmSavePrivileges}
                        >
                          <span className="flex items-center gap-1">
                            <span>Confirm</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagerUI;