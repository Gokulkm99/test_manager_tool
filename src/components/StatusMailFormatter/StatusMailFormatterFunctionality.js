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

  // Fetch projects, labels, and task types from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsResponse = await fetch('http://localhost:4000/api/projects');
        const projectsData = await projectsResponse.json();
        if (projectsResponse.ok) {
          setMainProjects(projectsData);
          const firstProject = Object.keys(projectsData)[0];
          setMainProject(firstProject || '');
          setSubProject(projectsData[firstProject]?.[0] || '');
        }

        // Fetch labels
        const labelsResponse = await fetch('http://localhost:4000/api/labels');
        const labelsData = await labelsResponse.json();
        if (labelsResponse.ok) {
          setLabels(labelsData);
        }

        // Fetch task types
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

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/tasks/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setTasks(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Add a task
  const handleAddTask = async () => {
    if (!mainProject || !subProject || !taskDescription || !taskType) {
      alert('Please fill all required fields.');
      return;
    }
    if (label && !comment) {
      alert('Comment is required when a label is selected.');
      return;
    }

    const newTask = {
      user_id: user.id,
      main_project: mainProject,
      sub_project: subProject,
      task_description: taskDescription,
      status,
      task_type: taskType,
      label: label || undefined,
      comment: comment || undefined,
    };

    try {
      const response = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const savedTask = await response.json();
      if (response.ok) {
        setTasks([savedTask, ...tasks]);
        setTaskDescription('');
        setLabel('');
        setComment('');
        setTaskType(taskTypes[0] || '');
      } else {
        alert(savedTask.error || 'Failed to add task');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add task');
    }
  };

  // Generate email body
  const generateEmailBody = () => {
    const sections = ['<p>Hi Team,</p><p>Please find below today\'s task updates:</p>'];
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
          const labelColor = labels[task.label] || '';
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
      <p><br>--<br>Thanks & Regards,<br><b>${user.username}</b><br>
      Caparizon Software Ltd<br>
      D-75, 8th Floor, Infra Futura, Kakkanaad, Kochi - 682021<br>
      Mobile: 1234567890<br>
      Office: +91 - 9400359991<br>
      <a href="mailto:${user.email}">${user.email}</a><br>
      <a href="http://www.caparizon.com">www.caparizon.com</a>
      </p>
    `);

    return sections.join('');
  };

  const handleCopyEmail = () => {
    const html = generateEmailBody();
    navigator.clipboard.writeText(html);
    alert('Email body copied to clipboard!');
  };

  return (
    <StatusMailFormatterUI
      user={user}
      hasAccess={hasAccess}
      tasks={tasks}
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
    />
  );
};

export default StatusMailFormatterFunctionality;