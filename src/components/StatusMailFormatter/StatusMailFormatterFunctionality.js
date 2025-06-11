import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext';
import StatusMailFormatterUI from './StatusMailFormatterUI';

const StatusMailFormatterFunctionality = () => {
  const { user, hasAccess } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [mainProject, setMainProject] = useState('');
  const [subProject, setSubProject] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState('Completed');
  const [taskType, setTaskType] = useState('');
  const [label, setLabel] = useState('');
  const [comment, setComment] = useState('');
  const [mainProjects, setMainProjects] = useState({});
  const [labels, setLabels] = useState({});
  const [taskTypes, setTaskTypes] = useState([]);
  const [settings, setSettings] = useState({
    greeting: 'Hi Team,\n\nPlease find below today\'s task updates:',
    name: user?.username || 'admin',
    mobile: '1234567890',
    email: user?.email || 'admin@caparizon.com',
  });

  // Load tasks from localStorage (12-hour expiry)
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      const now = new Date().getTime();
      const twelveHours = 12 * 60 * 60 * 1000;
      if (now - parsed.timestamp < twelveHours) {
        setTasks(parsed.tasks);
      } else {
        localStorage.removeItem('tasks');
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify({
        tasks,
        timestamp: new Date().getTime(),
      }));
    }
  }, [tasks]);

  // Load user settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user-settings/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    if (user) {
      fetchSettings();
    }
  }, [user]);

  // Fetch projects, labels, task types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await fetch('http://localhost:4000/api/projects');
        const projectsData = await projectsResponse.json();
        if (projectsResponse.ok) {
          setMainProjects(projectsData);
          const firstProject = Object.keys(projectsData)[0];
          setMainProject(firstProject || '');
          setSubProject(projectsData[firstProject]?.[0] || '');
        }

        const labelsResponse = await fetch('http://localhost:4000/api/labels');
        const labelsData = await labelsResponse.json();
        if (labelsResponse.ok) {
          setLabels(labelsData);
        }

        const taskTypesResponse = await fetch('http://localhost:4000/api/task-types');
        const taskTypesData = await taskTypesResponse.json();
        if (taskTypesResponse.ok) {
          setTaskTypes(taskTypesData);
          setTaskType(taskTypesData[0] || '');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Save settings to backend
  const handleSaveSettings = async (newSettings) => {
    try {
      const response = await fetch('http://localhost:4000/api/user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ...newSettings }),
      });
      const data = await response.json();
      if (response.ok) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Add task
  const handleAddTask = () => {
    if (!mainProject || !subProject || !taskDescription || !taskType) {
      alert('Please fill all required fields.');
      return;
    }
    if (label && !comment) {
      alert('Comment required when label is selected.');
      return;
    }

    const newTask = {
      id: Date.now(),
      user_id: user.id,
      main_project: mainProject,
      sub_project: subProject,
      task_description: taskDescription,
      status,
      task_type: taskType,
      label: label || '',
      comment: comment || '',
    };

    setTasks([newTask, ...tasks]);
    setTaskDescription('');
    setLabel('');
    setComment('');
    setTaskType(taskTypes[0] || '');
  };

  // Generate plain text email body
  const generatePlainTextEmailBody = () => {
    const sections = [settings.greeting + '\n'];
    const grouped = {};

    tasks.forEach((task) => {
      const { main_project, sub_project } = task;
      if (!grouped[main_project]) grouped[main_project] = {};
      if (!grouped[main_project][sub_project]) grouped[main_project][sub_project] = [];
      grouped[main_project][sub_project].push(task);
    });

    let mainIdx = 1;
    for (const mainProj in grouped) {
      sections.push(`${mainIdx}. ${mainProj}\n`);
      let subIdx = 1;
      for (const subProj in grouped[mainProj]) {
        sections.push(`  ${mainIdx}.${subIdx} ${subProj}\n`);
        const taskItems = grouped[mainProj][subProj].map((task) => {
          const statusColor = {
            Completed: '[GREEN]',
            'In Progress': '[ORANGE]',
            'To Be Done': '[BLUE]',
            Blocked: '[RED]',
          }[task.status];
          const taskTypeDisplay = task.task_type !== 'Normal' ? ` (${task.task_type})` : '';
          const statusDisplay = `${task.status}${taskTypeDisplay}`;
          const labelPart = task.label ? ` ${task.label}` : '';
          const commentPart = task.comment ? ` - ${task.comment}` : '';
          return `    * ${statusColor}${statusDisplay}${labelPart} - ${task.task_description}${commentPart}\n`;
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

  // Generate HTML email body
  const generateEmailBody = () => {
    const sections = [`<p>${settings.greeting.replace('\n', '<br>')}</p>`];
    const grouped = {};

    tasks.forEach((task) => {
      const { main_project, sub_project } = task;
      if (!grouped[main_project]) grouped[main_project] = {};
      if (!grouped[main_project][sub_project]) grouped[main_project][sub_project] = [];
      grouped[main_project][sub_project].push(task);
    });

    let mainIdx = 1;
    for (const mainProj in grouped) {
      sections.push(`<h4><u>${mainIdx}. ${mainProj}</u></h4>`);
      let subIdx = 1;
      for (const subProj in grouped[mainProj]) {
        sections.push(`<h5>${mainIdx}.${subIdx} ${subProj}</h5><ul>`);
        const taskItems = grouped[mainProj][subProj].map((task) => {
          const statusColor = {
            Completed: '#5e8f59',
            'In Progress': '#c06530',
            'To Be Done': '#029de6',
            Blocked: '#ff0000',
          }[task.status];
          const labelColor = labels[task.label] || '#666666';
          const taskTypeDisplay = task.task_type !== 'Normal' ? ` (${task.task_type})` : '';
          const statusDisplay = `${task.status}${taskTypeDisplay}`;
          const labelPart = task.label ? `<span style="color:${labelColor}">${task.label}</span>` : '';
          const commentPart = task.comment ? `<span style="color:#666666">${task.comment}</span>` : '';
          const labelComment = labelPart && commentPart ? `${labelPart} - ${commentPart}` : labelPart || commentPart;
          const subpoints = labelComment ? `<ul><li>${labelComment}</li></ul>` : '';
          return `<li><span style="color:${statusColor}">${statusDisplay}</span> - ${task.task_description}${subpoints}</li>`;
        });
        sections.push(...taskItems);
        sections.push(`</ul>`);
        subIdx++;
      }
      mainIdx++;
    }

    sections.push(`
      <p><br>--<br>Thanks & Regards,<br><b>${settings.name}</b><br>
      Caparizon Software Ltd<br>
      D-75, 8th Floor, Infra Futura, Kakkanaad, Kochi - 682021<br>
      Mobile: ${settings.mobile}<br>
      Office: +91 - 9400359991<br>
      <a href="mailto:${settings.email}">${settings.email}</a><br>
      <a href="http://www.caparizon.com">www.caparizon.com</a>
      </p>
    `);

    return sections.join('');
  };

  const handleCopyEmail = () => {
    const plainText = generatePlainTextEmailBody();
    navigator.clipboard.writeText(plainText);
    alert('Email body copied to clipboard!');
    return generateEmailBody();
  };

  const handleOpenOutlook = () => {
    const plainText = generatePlainTextEmailBody();
    const ccEmails = 'SRUTH@CAP.COM;GOK@CAP.COM';
    const subject = `Daily Status ${new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}`;
    const mailtoUrl = `mailto:?cc=${encodeURIComponent(ccEmails)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainText)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <StatusMailFormatterUI
      user={user}
      hasAccess={hasAccess}
      tasks={tasks}
      setTasks={setTasks}
      mainProject={mainProject}
      setMainProject={setMainProject}
      subProject={subProject}
      setSubProject={setSubProject}
      taskDescription={taskDescription}
      setTaskDescription={setTaskDescription}
      status={status}
      setStatus={setStatus}
      taskType={taskType}
      setTaskType={setTaskType}
      label={label}
      setLabel={setLabel}
      comment={comment}
      setComment={setComment}
      mainProjects={mainProjects}
      labels={labels}
      taskTypes={taskTypes}
      handleAddTask={handleAddTask}
      handleCopyEmail={handleCopyEmail}
      handleOpenOutlook={handleOpenOutlook}
      generateEmailBody={generateEmailBody}
      settings={settings}
      handleSaveSettings={handleSaveSettings}
    />
  );
};

export default StatusMailFormatterFunctionality;