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
  const [note, setNote] = useState('');
  const [mainProjects, setMainProjects] = useState({});
  const [labels, setLabels] = useState({});
  const [taskTypes, setTaskTypes] = useState([]);
  const [settings, setSettings] = useState(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load tasks, subject, and note from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedSubject = localStorage.getItem('subject');
    const savedNote = localStorage.getItem('note');
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const twelveHours = 12 * 60 * 60 * 1000;

    // Tasks (12-hour expiry)
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      if (now.getTime() - parsed.timestamp < twelveHours) {
        setTasks(parsed.tasks);
      } else {
        localStorage.removeItem('tasks');
      }
    }

    // Subject (reset at 11:59 PM daily)
    if (savedSubject) {
      const parsed = JSON.parse(savedSubject);
      if (now.getTime() < parsed.expiry) {
        setSettings((prev) => ({ ...prev, subject: parsed.subject }));
      } else {
        localStorage.removeItem('subject');
      }
    }

    // Note (12-hour expiry)
    if (savedNote) {
      const parsed = JSON.parse(savedNote);
      if (now.getTime() - parsed.timestamp < twelveHours) {
        setNote(parsed.note);
      } else {
        localStorage.removeItem('note');
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

  // Save subject to localStorage with daily expiry
  useEffect(() => {
    if (settings?.subject) {
      const now = new Date();
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      localStorage.setItem('subject', JSON.stringify({
        subject: settings.subject,
        expiry: todayMidnight.getTime(),
      }));
    }
  }, [settings?.subject]);

  // Save note to localStorage
  useEffect(() => {
    if (note) {
      localStorage.setItem('note', JSON.stringify({
        note,
        timestamp: new Date().getTime(),
      }));
    }
  }, [note]);

  // Load user settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/user-settings/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          const savedSubject = localStorage.getItem('subject');
          const now = new Date();
          const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          let subject = `Daily Status ${new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}`;
          if (savedSubject) {
            const parsed = JSON.parse(savedSubject);
            if (now.getTime() < parsed.expiry) {
              subject = parsed.subject;
            }
          } else if (data.subject) {
            subject = data.subject;
          }
          setSettings({
            greeting: data.greeting,
            name: data.name,
            mobile: data.mobile,
            email: data.email,
            designation: data.designation,
            toEmails: data.to_emails,
            ccEmails: data.cc_emails,
            subject,
          });
        } else {
          console.error('No settings found:', data.error);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setSettingsLoaded(true);
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
      const payload = {
        user_id: user.id,
        greeting: newSettings.greeting,
        name: newSettings.name,
        mobile: newSettings.mobile,
        email: newSettings.email,
        designation: newSettings.designation,
        to_emails: newSettings.toEmails,
        cc_emails: newSettings.ccEmails,
        subject: newSettings.subject,
      };
      const response = await fetch('http://localhost:4000/api/user-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        setSettings({
          greeting: data.greeting,
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          designation: data.designation,
          toEmails: data.to_emails,
          ccEmails: data.cc_emails,
          subject: data.subject,
        });
      } else {
        console.error('Error saving settings:', data.error);
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
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
    setStatus('Completed');
  };

  // Reorder tasks
  const handleReorderTasks = (newTasks) => {
    setTasks(newTasks);
  };

  // Generate HTML email body for preview and Outlook
  const generateEmailBody = (preview = true) => {
    if (!settings) return '';
    const sections = [
      `<html><body style="font-family: Calibri; color: #ffffff; background-color: #1f2937;">`,
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
        grouped[mainProj][subProj].forEach((task) => {
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
          sections.push(`<li style="color: #ffffff;">${statusDisplay}${taskTypeDisplay} - ${text}${subpoints}</li>`);
        });
        sections.push(`</ul>`);
        subIdx++;
      }
      mainIdx++;
    }

    // Add Note section if note exists
    if (note) {
      sections.push(`<h4 style="font-weight: bold; color: #ffffff;">Note:</h4>`);
      sections.push(`<p style="color: #ffffff; margin-left: 20px;">${note.replace(/\n/g, '<br>')}</p>`);
    }

    const logoImg = preview ? `` : `<img src="https://via.placeholder.com/100x50.png?text=Caparizon+Logo" alt="Caparizon Logo" style="width:100px;height:auto;">`;
    const designation = preview ? `${settings.designation}` : `${settings.designation}`;

    sections.push(`
      <p style="color: #ffffff;">--<br>Thanks & Regards,<br><b style="font-weight: 700;">${settings.name}</b><br>${designation}<br>${logoImg}<br>Caparizon Software Ltd<br>D-75, 8th Floor, Infra Futura, Kakkanaad, Kochi - 682021<br>Mobile: ${settings.mobile}<br>Office: +91 - 9400359991<br><a href="mailto:${settings.email}" style="color: #60a5fa">${settings.email}</a><br><a href="http://www.caparizon.com" style="color: #60a5fa">www.caparizon.com</a></p>
      </body></html>
    `);

    return sections.join('');
  };

  // Generate plain text for copy (greeting, tasks, and note only)
  const generatePlainTextEmailBody = () => {
    if (!settings) return '';
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
      sections.push(`\n${mainIdx}. ${mainProj}\n${'-'.repeat(mainProj.length + 3)}\n`);
      let subIdx = 1;
      for (const subProj in grouped[mainProj]) {
        sections.push(`  ${mainIdx}.${subIdx} ${subProj}\n`);
        const taskItems = grouped[mainProj][subProj].map((task) => {
          const taskTypeDisplay = task.task_type !== 'Normal' ? ` (${task.task_type})` : '';
          const statusDisplay = `${task.status}`;
          const labelPart = task.label ? ` ${task.label}` : '';
          const commentPart = task.comment ? ` - ${task.comment}` : '';
          const labelComment = labelPart && commentPart ? `${labelPart}${commentPart}` : labelPart || commentPart;
          const subpoints = labelComment ? `      • ${labelComment}\n` : '';
          return `    • ${statusDisplay}${taskTypeDisplay} - ${task.task_description}\n${subpoints}`;
        });
        sections.push(...taskItems);
        subIdx++;
      }
      mainIdx++;
    }

    if (note) {
      sections.push(`\nNote:\n${note}\n`);
    }

    return sections.join('');
  };

  const handleCopyEmail = () => {
    if (!settings) {
      alert('Please configure and save your settings first.');
      return;
    }
    const plainText = generatePlainTextEmailBody();
    navigator.clipboard.writeText(plainText);
    alert('Email body (greeting, tasks, and note) copied to clipboard!');
    return generateEmailBody(true);
  };

  // Open Outlook Web App
  const handleOpenOutlook = () => {
    if (!settings) {
      alert('Please configure and save your settings first.');
      return;
    }
    try {
      const htmlBody = generateEmailBody(false);
      const subject = settings.subject || `Daily Status ${new Date().toLocaleDateString('en-GB').replace(/\//g, '/')}`;
      const encodedBody = encodeURIComponent(htmlBody);
      const encodedTo = encodeURIComponent(settings.toEmails || '');
      const encodedCc = encodeURIComponent(settings.ccEmails || '');
      const encodedSubject = encodeURIComponent(subject);
      const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodedTo}&cc=${encodedCc}&subject=${encodedSubject}&body=${encodedBody}`;
      window.open(outlookUrl, '_blank');
    } catch (error) {
      console.error('Error opening Outlook Web:', error);
      alert('Failed to open Outlook Web. Please try copying the email body and pasting it manually.');
    }
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
      note={note}
      setNote={setNote}
      mainProjects={mainProjects}
      labels={labels}
      taskTypes={taskTypes}
      handleAddTask={handleAddTask}
      handleCopyEmail={handleCopyEmail}
      handleOpenOutlook={handleOpenOutlook}
      generateEmailBody={generateEmailBody}
      settings={settings}
      handleSaveSettings={handleSaveSettings}
      settingsLoaded={settingsLoaded}
      handleReorderTasks={handleReorderTasks}
    />
  );
};

export default StatusMailFormatterFunctionality;