import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, useMouseSensor, useKeyboardSensor } from '@hello-pangea/dnd';

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
  note,
  setNote,
  mainProjects,
  labels,
  taskTypes,
  handleAddTask,
  handleCopyEmail,
  handleOpenOutlook,
  generateEmailBody,
  settings,
  handleSaveSettings,
  settingsLoaded,
  handleReorderTasks,
}) => {
  const [editingTask, setEditingTask] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Update tempSettings when settings prop changes
  useEffect(() => {
    if (settings) {
      setTempSettings(settings);
    }
  }, [settings]);

  const [tempSettings, setTempSettings] = useState(settings || {
    greeting: '',
    name: '',
    mobile: '',
    email: '',
    designation: '',
    toEmails: '',
    ccEmails: '',
    subject: `Daily Status ${new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}`,
  });

  if (!hasAccess('/status-mail-formatter')) {
    return <div className="p-4 text-gray-300 text-center">You do not have access to this tab.</div>;
  }

  if (!settingsLoaded) {
    return <div className="p-4 text-gray-300 text-center">Loading settings...</div>;
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
    setStatus('Completed');
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleCopyTask = (task) => {
    const taskText = `[${task.main_project}][${task.sub_project}] ${task.status} (${task.task_type}) ${task.task_description}${task.label ? ` ${task.label}` : ''}${task.comment ? ` - ${task.comment}` : ''}`;
    navigator.clipboard.writeText(taskText);
    alert('Task copied to clipboard!');
  };

  const handleExportHTML = () => {
    if (!settings) {
      alert('Please configure and save your settings first.');
      return;
    }
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
    if (!tempSettings.greeting || !tempSettings.name || !tempSettings.mobile || !tempSettings.email || !tempSettings.designation || !tempSettings.subject) {
      alert('Please fill all required settings fields.');
      return;
    }
    handleSaveSettings(tempSettings);
    setShowSettings(false);
  };

  const renderTextWithLinks = (text) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" style="color:#60a5fa">${url}</a>`);
  };

  const renderPreviewText = () => {
    if (!settings) return 'Please configure and save your settings first.';
    const sections = [
      `<b>Subject:</b> ${settings.subject || 'Not set'}<br>`,
      `<b>To:</b> ${settings.toEmails || 'Not set'}<br>`,
      `<b>CC:</b> ${settings.ccEmails || 'Not set'}<br><br>`,
      `<p style="color: #ffffff;">${settings.greeting.replace(/\n/g, '<br>')}</p>`,
    ];

    const grouped = {};

    tasks.forEach((task) => {
      const { main_project, sub_project } = task;
      if (!grouped[main_project]) grouped[main_project] = {};
      if (!grouped[main_project][sub_project]) grouped[main_project][sub_project] = [];
      grouped[main_project][sub_project].push(task);
    });

    let mainIdx = 1;
    for (const mainProj in grouped) {
      sections.push(`<h4 style="font-weight: bold; text-decoration: underline; color: #ffffff;">${mainIdx}. ${mainProj}</h4>`);
      let subIdx = 1;
      for (const subProj in grouped[mainProj]) {
        sections.push(`<h5 style="font-weight: bold; color: #ffffff; margin-left: 20px;">${mainIdx}.${subIdx} ${subProj}</h5>`);
        sections.push(`<ul style="margin-left: 40px; list-style-type: disc;">`);
        const taskItems = grouped[mainProj][subProj].map((task) => {
          const statusColor = {
            Completed: '#5e8f59',
            'In Progress': '#c06530',
            'To Be Done': '#029de6',
            Blocked: '#ff0000',
          }[task.status];
          let text = task.task_description;
          if (text.includes("http")) {
            const words = text.split(" ");
            text = words.map(word => word.startsWith("http") ? `<a href="${word}" style="color: #60a5fa">${word}</a>` : word).join(" ");
          }
          const taskTypeDisplay = task.task_type !== 'Normal' ? ` (${task.task_type})` : '';
          const statusDisplay = `<span style="color:${statusColor}">${task.status}</span>`;
          let comment = task.comment || "";
          if (comment.includes("http")) {
            const words = comment.split(" ");
            comment = words.map(word => word.startsWith("http") ? `<a href="${word}" style="color: #60a5fa">${word}</a>` : word).join(" ");
          }
          const labelColor = labels[task.label] || '#666666';
          const labelPart = task.label ? `<span style="color:${labelColor}">${task.label}</span>` : '';
          const commentPart = comment ? `<span style="color:#ffffff">${comment}</span>` : '';
          const labelComment = labelPart && commentPart ? `${labelPart} - ${commentPart}` : labelPart || commentPart;
          const subpoints = labelComment ? `<ul style="margin-left: 20px; list-style-type: disc;"><li style="color: #ffffff;">${labelComment}</li></ul>` : '';
          return `<li style="color: #ffffff;">${statusDisplay}${taskTypeDisplay} - ${text}${subpoints}</li>`;
        });
        sections.push(...taskItems, `</ul>`);
        subIdx++;
      }
      mainIdx++;
    }

    if (note) {
      sections.push(`<h4 style="font-weight: bold; color: #ffffff;">Note:</h4>`);
      sections.push(`<p style="color: #ffffff; margin-left: 20px;">${note.replace(/\n/g, '<br>')}</p>`);
    }

    sections.push(`
      <p style="color: #ffffff;">--<br>Thanks & Regards,<br><b style="font-weight: 700;">${settings.name}</b><br>${settings.designation}<br><img src="https://via.placeholder.com/100x50.png?text=Caparizon+Logo" alt="Caparizon Logo" style="width:100px;height:auto;"><br>Caparizon Software Ltd<br>D-75, 8th Floor, Infra Futura, Kakkanaad, Kochi - 682021<br>Mobile: ${settings.mobile}<br>Office: +91 - 9400359991<br><a href="mailto:${settings.email}" style="color: #60a5fa">${settings.email}</a><br><a href="http://www.caparizon.com" style="color: #60a5fa">www.caparizon.com</a></p>
    `);
    return sections.join('');
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      console.log('No destination for drag');
      return;
    }
    try {
      const reorderedTasks = Array.from(tasks);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      handleReorderTasks(reorderedTasks);
    } catch (error) {
      console.error('Error during drag-and-drop:', error);
    }
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100 text-center flex-1">Status Mail Formatter</h2>
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-gray-200"
              title="Settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.0 001 a0.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37 a1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0 a1.724 0.00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37 a1.724 0.00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35 a1.724 0.001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 a1.724 0.002.573-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Project Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-300 text-sm mb-1">
                  Main Project: <span className="text-red-400">*</span>
                </label>
                <select
                  value={mainProject}
                  onChange={(e) => {
                    setMainProject(e.target.value);
                    setSubProject(mainProjects[e.target.value]?.[0] || '');
                  }}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-200">Select Main Project</option>
                  {Object.keys(mainProjects).map((proj) => (
                    <option key={proj} value={proj} className="bg-gray-700 text-gray-200">{proj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-300 text-sm mb-1">
                  Sub-Project: <span className="text-red-400">*</span>
                </label>
                <select
                  value={subProject}
                  onChange={(e) => setSubProject(e.target.value)}
                  disabled={!mainProject}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 transition duration-200 disabled:opacity-50 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-200">Select Sub-Project</option>
                  {mainProject && mainProjects[mainProject]?.map((sub) => (
                    <option key={sub} value={sub} className="bg-gray-700 text-gray-200">{sub}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Task Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-gray-300 text-sm mb-1">
                  Task Description: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                  placeholder="Task description"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-300 text-sm mb-1">Select Label:</label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                >
                  <option value="" className="bg-gray-700 text-gray-200">None</option>
                  {Object.keys(labels).map((lbl) => (
                    <option key={lbl} value={lbl} className="bg-gray-700 text-gray-200">{lbl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-300 text-sm mb-1">Comments:</label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                  placeholder="Enter comments"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-300 text-sm mb-1">
                  Task Type: <span className="text-red-400">*</span>
                </label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                >
                  {taskTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-700 text-gray-200">{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block font-semibold text-gray-300 text-sm mb-1">
                Select Status: <span className="text-red-400">*</span>
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
            <div className="mt-3">
              <label className="block font-semibold text-gray-300 text-sm mb-1">Note:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                rows="3"
                placeholder="Enter note (optional)"
              />
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
                  onClick={() => {
                    setEditingTask(null);
                    setStatus('Completed');
                  }}
                  className="w-full md:w-auto bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Task List</h3>
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-center text-sm">No tasks added yet.</p>
            ) : (
              <DragDropContext
                onDragEnd={onDragEnd}
                sensors={[useMouseSensor, useKeyboardSensor]}
                collisionDetection="closestCorners"
              >
                <Droppable droppableId="tasks">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex flex-col gap-2 ${snapshot.isDraggingOver ? 'bg-gray-600' : ''}`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-gray-700 p-2 rounded-md shadow-sm hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between ${snapshot.isDragging ? 'bg-gray-500' : ''}`}
                            >
                              <div className="flex items-center">
                                <div className="text-gray-400 hover:text-gray-300 mr-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                  </svg>
                                </div>
                                <div className="flex-1 text-sm truncate flex items-center">
                                  <span className="mr-2 font-medium text-gray-300">{index + 1}.</span>
                                  <span
                                    className={`font-medium ${
                                      {
                                        Completed: 'text-green-400',
                                        'In Progress': 'text-orange-400',
                                        'To Be Done': 'text-blue-400',
                                        Blocked: 'text-red-400',
                                      }[task.status]
                                    }`}
                                    dangerouslySetInnerHTML={{
                                      __html: `[${task.main_project}][${task.sub_project}] ${task.status} (${task.task_type}) ${renderTextWithLinks(task.task_description)}${task.label ? ` ${task.label}` : ''}${task.comment ? ` - ${renderTextWithLinks(task.comment)}` : ''}`,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditTask(task)}
                                  className="text-blue-400 hover:text-blue-300"
                                  title="Edit Task"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleCopyTask(task)}
                                  className="text-gray-400 hover:text-gray-300"
                                  title="Copy Task"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2M8 5h8" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-red-400 hover:text-red-300"
                                  title="Delete Task"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-800 bg-opacity-90 pt-2 pb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Export Options</h3>
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

          {settingsLoaded && !settings && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md shadow-lg text-sm font-medium flex items-center gap-2 z-20">
              <span>Please configure your settings to use this feature.</span>
              <button
                onClick={() => setShowSettings(true)}
                className="bg-white text-red-600 px-2 py-1 rounded-md hover:bg-gray-100"
              >
                Add Settings
              </button>
            </div>
          )}

          {showPreview && settings && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Email Preview</h3>
                <div className="text-sm whitespace-pre-wrap text-gray-300" dangerouslySetInnerHTML={{ __html: renderPreviewText() }} />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Settings</h3>
                <div className="flex-1 overflow-y-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Subject <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={tempSettings.subject}
                      onChange={(e) => setTempSettings({ ...tempSettings, subject: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Enter email subject"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Greeting <span className="text-red-400">*</span></label>
                    <textarea
                      value={tempSettings.greeting}
                      onChange={(e) => setTempSettings({ ...tempSettings, greeting: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      rows="4"
                      placeholder="Enter email greeting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={tempSettings.name}
                      onChange={(e) => setTempSettings({ ...tempSettings, name: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Designation <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={tempSettings.designation}
                      onChange={(e) => setTempSettings({ ...tempSettings, designation: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Enter your designation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Mobile <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={tempSettings.mobile}
                      onChange={(e) => setTempSettings({ ...tempSettings, mobile: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email <span className="text-red-400">*</span></label>
                    <input
                      type="email"
                      value={tempSettings.email}
                      onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">To Emails (semicolon-separated)</label>
                    <input
                      type="text"
                      value={tempSettings.toEmails}
                      onChange={(e) => setTempSettings({ ...tempSettings, toEmails: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="e.g., user1@example.com;user2@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CC Emails (semicolon-separated)</label>
                    <input
                      type="text"
                      value={tempSettings.ccEmails}
                      onChange={(e) => setTempSettings({ ...tempSettings, ccEmails: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="e.g., user1@example.com;user2@example.com"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
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