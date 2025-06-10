import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../AuthContext'; 
import UserDetailsFormFunctionality from '../UserDetailsForm/UserDetailsFormFunctionality';
import SettingsCardUI from './SettingsCardUI';

const SettingsCardFunctionality = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('user-details');
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    designation: '',
    employee_id: '',
  });
  const [projects, setProjects] = useState({});
  const [newProject, setNewProject] = useState('');
  const [newSubProject, setNewSubProject] = useState({ mainProject: '', subProject: '' });
  const [labels, setLabels] = useState({});
  const [newLabel, setNewLabel] = useState({ label_name: '', color: '#000000' });
  const [taskTypes, setTaskTypes] = useState([]);
  const [newTaskType, setNewTaskType] = useState('');
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(null);
  const [confirmDeleteSubProject, setConfirmDeleteSubProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await fetch('http://localhost:4000/api/projects');
        const projectsData = await projectsResponse.json();
        if (projectsResponse.ok) {
          setProjects(projectsData);
          setNewSubProject({ mainProject: Object.keys(projectsData)[0] || '', subProject: '' });
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
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        setNewUser({ username: '', password: '', email: '', designation: '', employee_id: '' });
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_name: newProject }),
      });
      const data = await response.json();
      if (response.ok) {
        setProjects({ ...projects, [newProject]: [] });
        setNewProject('');
        setError('');
      } else {
        setError(data.error || 'Failed to add project');
      }
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Failed to add project');
    }
  };

  const handleAddSubProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/subprojects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubProject),
      });
      const data = await response.json();
      if (response.ok) {
        setProjects({
          ...projects,
          [newSubProject.mainProject]: [...(projects[newSubProject.mainProject] || []), newSubProject.subProject],
        });
        setNewSubProject({ mainProject: newSubProject.mainProject, subProject: '' });
        setError('');
      } else {
        setError(data.error || 'Failed to add sub-project');
      }
    } catch (err) {
      console.error('Error adding sub-project:', err);
      setError('Failed to add sub-project');
    }
  };

  const handleDeleteProject = async (projectName) => {
    try {
      const response = await fetch(`http://localhost:4000/api/projects/${projectName}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedProjects = { ...projects };
        delete updatedProjects[projectName];
        setProjects(updatedProjects);
        setConfirmDeleteProject(null);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const handleDeleteSubProject = async (mainProject, subProject) => {
    try {
      const response = await fetch(`http://localhost:4000/api/subprojects/${mainProject}/${subProject}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProjects({
          ...projects,
          [mainProject]: projects[mainProject].filter(sub => sub !== subProject),
        });
        setConfirmDeleteSubProject(null);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete sub-project');
      }
    } catch (err) {
      console.error('Error deleting sub-project:', err);
      setError('Failed to delete sub-project');
    }
  };

  const handleAddLabel = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLabel),
      });
      const data = await response.json();
      if (response.ok) {
        setLabels({ ...labels, [newLabel.label_name]: newLabel.color });
        setNewLabel({ label_name: '', color: '#000000' });
        setError('');
      } else {
        setError(data.error || 'Failed to add label');
      }
    } catch (err) {
      console.error('Error adding label:', err);
      setError('Failed to add label');
    }
  };

  const handleDeleteLabel = async (labelName) => {
    try {
      const response = await fetch(`http://localhost:4000/api/labels/${labelName}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedLabels = { ...labels };
        delete updatedLabels[labelName];
        setLabels(updatedLabels);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete label');
      }
    } catch (err) {
      console.error('Error deleting label:', err);
      setError('Failed to delete label');
    }
  };

  const handleAddTaskType = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/task-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_type: newTaskType }),
      });
      const data = await response.json();
      if (response.ok) {
        setTaskTypes([...taskTypes, newTaskType]);
        setNewTaskType('');
        setError('');
      } else {
        setError(data.error || 'Failed to add task type');
      }
    } catch (err) {
      console.error('Error adding task type:', err);
      setError('Failed to add task type');
    }
  };

  const handleDeleteTaskType = async (taskType) => {
    try {
      const response = await fetch(`http://localhost:4000/api/task-types/${taskType}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTaskTypes(taskTypes.filter(tt => tt !== taskType));
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete task type');
      }
    } catch (err) {
      console.error('Error deleting task type:', err);
      setError('Failed to delete task type');
    }
  };

  return (
    <SettingsCardUI
      user={user}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      newUser={newUser}
      setNewUser={setNewUser}
      projects={projects}
      newProject={newProject}
      setNewProject={setNewProject}
      newSubProject={newSubProject}
      setNewSubProject={setNewSubProject}
      labels={labels}
      newLabel={newLabel}
      setNewLabel={setNewLabel}
      taskTypes={taskTypes}
      newTaskType={newTaskType}
      setNewTaskType={setNewTaskType}
      confirmDeleteProject={confirmDeleteProject}
      setConfirmDeleteProject={setConfirmDeleteProject}
      confirmDeleteSubProject={confirmDeleteSubProject}
      setConfirmDeleteSubProject={setConfirmDeleteSubProject}
      error={error}
      setError={setError}
      handleAddUser={handleAddUser}
      handleAddProject={handleAddProject}
      handleAddSubProject={handleAddSubProject}
      handleDeleteProject={handleDeleteProject}
      handleDeleteSubProject={handleDeleteSubProject}
      handleAddLabel={handleAddLabel}
      handleDeleteLabel={handleDeleteLabel}
      handleAddTaskType={handleAddTaskType}
      handleDeleteTaskType={handleDeleteTaskType}
      UserDetailsFormComponent={UserDetailsFormFunctionality}
    />
  );
};

export default SettingsCardFunctionality;