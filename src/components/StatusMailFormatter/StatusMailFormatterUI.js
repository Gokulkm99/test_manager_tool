import React from 'react';

const StatusMailFormatterUI = ({
  user,
  hasAccess,
  tasks,
  mainProject,
  setMainProject,
  subProject,
  setSubProject,
  taskDescription,
  setTaskDescription,
  status,
  setStatus,
  taskType,
  setTaskType,
  label,
  setLabel,
  comment,
  setComment,
  mainProjects,
  labels,
  taskTypes,
  handleAddTask,
  handleCopyEmail,
}) => {
  if (!hasAccess('/status-mail-formatter')) {
    return <div className="p-4 text-gray-800">You do not have access to this tab.</div>;
  }

  return (
    <div className="p-8 max-w-[1200px] mx-auto bg-white rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-1">
      <h2 className="text-3xl text-gray-800 mb-5">Status Mail Formatter</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Project Selection</h3>
        <div className="mb-5">
          <label className="font-bold text-gray-600">
            Main Project: <span className="text-red-500">*</span>
          </label>
          <select
            value={mainProject}
            onChange={(e) => {
              setMainProject(e.target.value);
              setSubProject(mainProjects[e.target.value]?.[0] || '');
            }}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          >
            <option value="">Select Main Project</option>
            {Object.keys(mainProjects).map((proj) => (
              <option key={proj} value={proj}>{proj}</option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label className="font-bold text-gray-600">
            Sub-Project: <span className="text-red-500">*</span>
          </label>
          <select
            value={subProject}
            onChange={(e) => setSubProject(e.target.value)}
            disabled={!mainProject}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          >
            <option value="">Select Sub-Project</option>
            {mainProject && mainProjects[mainProject]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Task Details</h3>
        <div className="mb-5">
          <label className="font-bold text-gray-600">
            Task Description: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          />
        </div>
        <div className="mb-5">
          <label className="font-bold text-gray-600">Select Label:</label>
          <select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          >
            <option value="">None</option>
            {Object.keys(labels).map((lbl) => (
              <option key={lbl} value={lbl}>{lbl}</option>
            ))}
          </select>
        </div>
        <div className="mb-5">
          <label className="font-bold text-gray-600">Comments:</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          />
        </div>
        <div className="mb-5">
          <label className="font-bold text-gray-600">
            Select Status: <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 flex gap-4">
            {['Completed', 'In Progress', 'To Be Done', 'Blocked'].map((stat) => (
              <label key={stat} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="status"
                  value={stat}
                  checked={status === stat}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-radio"
                />
                <span>{stat}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="font-bold text-gray-600">
            Task Type: <span className="text-red-500">*</span>
          </label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          >
            {taskTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Add Task
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Task List</h3>
        <ul className="list-none p-0">
          {tasks.map((task) => (
            <li key={task.id} className="py-2">
              [{task.main_project}][{task.sub_project}] {task.status} ({task.task_type}) {task.label ? `[${task.label}]` : ''} - {task.task_description}
              {task.comment && <span className="text-gray-600"> - {task.comment}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Export Options</h3>
        <button
          onClick={handleCopyEmail}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Copy Email Body
        </button>
      </div>
    </div>
  );
};

export default StatusMailFormatterUI;