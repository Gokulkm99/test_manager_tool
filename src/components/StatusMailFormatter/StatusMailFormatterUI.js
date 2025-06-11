import React, { useState } from 'react';

const StatusMailFormatterUI = ({
  user,
  hasAccess,
  tasks,
  setTasks,
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
  handleOpenOutlook,
  generateEmailBody,
  settings,
  handleSaveSettings,
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  if (!hasAccess('/status-mail-formatter')) {
    return <div className="p-4 text-gray-800 text-center">You do not have access to this tab.</div>;
  }

  const handleEditTask = (task) => {
    setEditingTask(task);
    setMainProject(task.main_project);
    setSubProject(task.sub_project);
    setTaskDescription(task.task_description);
    setStatus(task.status);
    setTaskType(task.task_type);
    setLabel(task.label || '');
    setComment(task.comment || '');
  };

  const handleSaveEdit = () => {
    setTasks(tasks.map((t) => (t.id === editingTask.id ? {
      ...t,
      main_project: mainProject,
      sub_project: subProject,
      task_description: taskDescription,
      status,
      task_type: taskType,
      label: label || undefined,
      comment: comment || undefined,
    } : t)));
    setEditingTask(null);
    setTaskDescription('');
    setLabel('');
    setComment('');
    setTaskType(taskTypes[0] || '');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleCopyTask = (task) => {
    const statusColor = {
      Completed: '[GREEN]',
      'In Progress': '[ORANGE]',
      'To Be Done': '[BLUE]',
      Blocked: '[RED]',
    }[task.status];
    const taskText = `[${task.main_project}][${task.sub_project}] ${statusColor}${task.status} (${task.task_type}) ${task.task_description}${task.label ? ` ${task.label}` : ''}${task.comment ? ` - ${task.comment}` : ''}`;
    navigator.clipboard.writeText(taskText);
    alert('Task copied to clipboard!');
  };

  const handleExportHTML = () => {
    const htmlContent = generateEmailBody();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_body.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSettingsModal = () => {
    handleSaveSettings(tempSettings);
    setShowSettings(false);
  };

  const renderPreviewText = () => {
    const plainText = settings.greeting + '\n';
    const grouped = {};

    tasks.forEach((task) => {
      const { main_project, sub_project } = task;
      if (!grouped[main_project]) grouped[main_project] = {};
      if (!grouped[main_project][sub_project]) grouped[main_project][sub_project] = [];
      grouped[main_project][sub_project].push(task);
    });

    let mainIdx = 1;
    let sections = [plainText];
    for (const mainProj in grouped) {
      sections.push(`${mainIdx}. ${mainProj}\n`);
      let subIdx = 1;
      for (const subProj in grouped[mainProj]) {
        sections.push(`  ${mainIdx}.${subIdx} ${subProj}\n`);
        const taskItems = grouped[mainProj][subProj].map((task) => {
          const statusColor = {
            Completed: '#5e8f59',
            'In Progress': '#c06530',
            'To Be Done': '#029de6',
            Blocked: '#ff0000',
          }[task.status];
          const taskTypeDisplay = task.task_type !== 'Normal' ? ` (${task.task_type})` : '';
          const statusDisplay = `${task.status}${taskTypeDisplay}`;
          const labelPart = task.label ? ` ${task.label}` : '';
          const commentPart = task.comment ? ` - ${task.comment}` : '';
          return `<span style="color:${statusColor}">    * ${statusDisplay}${labelPart} - ${task.task_description}${commentPart}</span>\n`;
        });
        sections.push(...taskItems);
        subIdx++;
      }
      mainIdx++;
    }

    sections.push(`
--
Thanks & Regards,
${settings.name}

Caparizon Software Ltd
D-75, 8th Floor, Infra Futura, Kakkanaad, Kochi - 682021
Mobile: ${settings.mobile}
Office: +91 - 9400359991
${settings.email}
www.caparizon.com
`);
    return sections.join('');
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#ff6f61] to-white bg-fixed flex flex-col">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute w-px h-px"
          style={{
            background: '#ffffff',
            boxShadow: `
              2vw 5vh 2px #ffffff,
              10vw 8vh 2px #ffffff,
              15vw 15vh 1px #ffffff,
              22vw 22vh 1px #ffffff,
              28vw 12vh 2px #ffffff,
              32vw 32vh 1px #ffffff,
              38vw 18vh 2px #ffffff,
              42vw 35vh 1px #ffffff,
              48vw 25vh 2px #ffffff,
              53vw 42vh 1px #ffffff,
              58vw 15vh 2px #ffffff,
              63vw 38vh 1px #ffffff,
              68vw 28vh 2px #ffffff,
              73vw 45vh 1px #ffffff,
              78vw 32vh 2px #ffffff,
              83vw 48vh 1px #ffffff,
              88vw 20vh 2px #ffffff,
              93vw 52vh 1px #ffffff,
              98vw 35vh 2px #ffffff,
              5vw 60vh 1px #ffffff,
              12vw 65vh 2px #ffffff,
              18vw 72vh 1px #ffffff,
              25vw 78vh 2px #ffffff,
              30vw 85vh 1px #ffffff,
              35vw 68vh 2px #ffffff,
              40vw 82vh 1px #ffffff,
              45vw 92vh 2px #ffffff,
              50vw 75vh 1px #ffffff,
              55vw 88vh 2px #ffffff,
              60vw 95vh 1px #ffffff
            `,
          }}
        ></div>
        <div
          className="absolute w-px h-px"
          style={{
            background: '#ffffff',
            boxShadow: `
              8vw 12vh 2px #ffffff,
              16vw 18vh 1px #ffffff,
              24vw 25vh 2px #ffffff,
              33vw 15vh 1px #ffffff,
              41vw 28vh 2px #ffffff,
              49vw 35vh 1px #ffffff,
              57vw 22vh 2px #ffffff,
              65vw 42vh 1px #ffffff,
              73vw 28vh 2px #ffffff,
              81vw 48vh 1px #ffffff,
              89vw 32vh 2px #ffffff,
              97vw 45vh 1px #ffffff,
              3vw 68vh 2px #ffffff,
              11vw 75vh 1px #ffffff,
              19vw 82vh 2px #ffffff,
              27vw 88vh 1px #ffffff,
              35vw 72vh 2px #ffffff
            `,
          }}
        ></div>
        <div
          className="absolute w-[80px] h-[2px] left-[-80px] top-[10%]"
          style={{
            background: 'linear-gradient(to right, #ffffff, transparent)',
            animation: 'shoot 3s infinite ease-in',
          }}
        ></div>
        <div
          className="absolute w-[80px] h-[2px] left-[-80px] top-[30%]"
          style={{
            background: 'linear-gradient(to right, #ffffff, transparent)',
            animation: 'shoot 3s infinite ease-in 1s',
          }}
        ></div>
        <div
          className="absolute w-[80px] h-[2px] left-[-80px] top-[50%]"
          style={{
            background: 'linear-gradient(to right, #ffffff, transparent)',
            animation: 'shoot 3s infinite ease-in 2s',
          }}
        ></div>
      </div>

      <div className="relative z-10 flex-1 p-4 mx-auto w-full">
        <div className="bg-white rounded-lg p-4 animate-fadeIn max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 text-center flex-1">Status Mail Formatter</h2>
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-600 hover:text-gray-800"
              title="Settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Project Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-600 text-sm mb-1">
                  Main Project: <span className="text-red-500">*</span>
                </label>
                <select
                  value={mainProject}
                  onChange={(e) => {
                    setMainProject(e.target.value);
                    setSubProject(mainProjects[e.target.value]?.[0] || '');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                >
                  <option value="">Select Main Project</option>
                  {Object.keys(mainProjects).map((proj) => (
                    <option key={proj} value={proj}>{proj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-600 text-sm mb-1">
                  Sub-Project: <span className="text-red-500">*</span>
                </label>
                <select
                  value={subProject}
                  onChange={(e) => setSubProject(e.target.value)}
                  disabled={!mainProject}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 transition duration-200 disabled:opacity-50 text-sm"
                >
                  <option value="">Select Sub-Project</option>
                  {mainProject && mainProjects[mainProject]?.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Task Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-600 text-sm mb-1">
                  Task Description: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 text-sm mb-1">Select Label:</label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                >
                  <option value="">None</option>
                  {Object.keys(labels).map((lbl) => (
                    <option key={lbl} value={lbl}>{lbl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-600 text-sm mb-1">Comments:</label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                  placeholder="Enter comments"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-600 text-sm mb-1">
                  Task Type: <span className="text-red-500">*</span>
                </label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                >
                  {taskTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block font-semibold text-gray-600 text-sm mb-1">
                Select Status: <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'Completed', color: 'text-green-600' },
                  { value: 'In Progress', color: 'text-orange-600' },
                  { value: 'To Be Done', color: 'text-blue-600' },
                  { value: 'Blocked', color: 'text-red-600' },
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
            <div className="mt-4 flex gap-2">
              <button
                onClick={editingTask ? handleSaveEdit : handleAddTask}
                className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                {editingTask ? 'Save Edit' : 'Add Task'}
              </button>
              {editingTask && (
                <button
                  onClick={() => setEditingTask(null)}
                  className="w-full md:w-auto bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Task List</h3>
            {tasks.length === 0 ? (
              <p className="text-gray-600 text-center text-sm">No tasks added yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 p-2 rounded-md shadow-sm hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                  >
                    <div className="flex-1 text-sm truncate">
                      <span
                        className={`font-medium ${
                          {
                            Completed: 'text-green-600',
                            'In Progress': 'text-orange-600',
                            'To Be Done': 'text-blue-600',
                            Blocked: 'text-red-600',
                          }[task.status]
                        }`}
                      >
                        [{task.main_project}][{task.sub_project}] {task.status} ({task.task_type}) {task.task_description}
                        {task.label && ` ${task.label}`}
                        {task.comment && ` - ${task.comment}`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCopyTask(task)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Copy Task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Task"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white pt-2 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Export Options</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleCopyEmail}
                className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Copy Email Body
              </button>
              <button
                onClick={handleExportHTML}
                className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
              >
                Export as HTML
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="w-full md:w-auto bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
              >
                Preview
              </button>
              <button
                onClick={handleOpenOutlook}
                className="w-full md:w-auto bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors duration-200 text-sm font-medium"
              >
                Open Outlook
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Preview</h3>
                <pre className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: renderPreviewText() }}></pre>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Greeting</label>
                    <textarea
                      value={tempSettings.greeting}
                      onChange={(e) => setTempSettings({ ...tempSettings, greeting: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      rows="4"
                      placeholder="Enter email greeting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={tempSettings.name}
                      onChange={(e) => setTempSettings({ ...tempSettings, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={tempSettings.mobile}
                      onChange={(e) => setTempSettings({ ...tempSettings, mobile: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={tempSettings.email}
                      onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSettingsModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusMailFormatterUI;