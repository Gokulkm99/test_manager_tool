const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure all responses are JSON, even for errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'caparizon_db',
  password: 'mysecurepassword', // Replace with your PostgreSQL password
  port: 5432,
});

// API Endpoints

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, designation: user.designation, employee_id: user.employee_id } });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot Password
app.post('/api/forgot-password', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query('SELECT email FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const email = result.rows[0].email;
    console.log(`Password reset requested for ${username}. Sending email to ${email}`);
    res.json({ message: `A password reset link has been sent to the email associated with ${username}` });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user details
app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, username, email, role, designation, employee_id FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user details
app.put('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, designation } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, designation = $3 WHERE id = $4 RETURNING *',
      [username, email, designation, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (for admin)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, designation, employee_id FROM users WHERE role != \'Admin\'');
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a user (for admin)
app.post('/api/users', async (req, res) => {
  const { username, password, email, designation, employee_id } = req.body;
  try {
    const checkResult = await pool.query('SELECT * FROM users WHERE employee_id = $1', [employee_id]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'Employee ID already exists' });
    }
    const result = await pool.query(
      'INSERT INTO users (username, password, email, role, designation, employee_id) VALUES ($1, $2, $3, \'User\', $4, $5) RETURNING id, username, email, role, designation, employee_id',
      [username, password, email, designation, employee_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a user (for admin)
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 AND role != \'Admin\' RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or cannot delete admin' });
    }
    await pool.query('DELETE FROM user_privileges WHERE user_id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user privileges
app.get('/api/privileges/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT tab_name, has_access FROM user_privileges WHERE user_id = $1', [user_id]);
    const privileges = result.rows.reduce((acc, row) => {
      acc[row.tab_name] = row.has_access;
      return acc;
    }, {});
    res.json({ privileges });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user privileges (for admin)
app.put('/api/user-privileges/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const privileges = req.body;
  try {
    for (const { tab_name, has_access } of privileges) {
      await pool.query(
        'INSERT INTO user_privileges (user_id, tab_name, has_access) VALUES ($1, $2, $3) ON CONFLICT (user_id, tab_name) DO UPDATE SET has_access = $3',
        [user_id, tab_name, has_access]
      );
    }
    res.json({ message: 'Privileges updated' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a task
app.post('/api/tasks', async (req, res) => {
  const { user_id, main_project, sub_project, task_description, status, task_type, label, comment } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, main_project, sub_project, task_description, status, task_type, label, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user_id, main_project, sub_project, task_description, status, task_type, label || null, comment || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks for a user
app.get('/api/tasks/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all projects and subprojects
app.get('/api/projects', async (req, res) => {
  try {
    const projectsResult = await pool.query('SELECT * FROM projects');
    const subprojectsResult = await pool.query('SELECT sp.*, p.main_project FROM subprojects sp JOIN projects p ON sp.project_id = p.id');
    const projects = projectsResult.rows.reduce((acc, proj) => {
      acc[proj.main_project] = subprojectsResult.rows
        .filter(sp => sp.main_project === proj.main_project)
        .map(sp => sp.sub_project);
      return acc;
    }, {});
    res.json(projects);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a project (for admin)
app.post('/api/projects', async (req, res) => {
  const { project_name } = req.body; // Changed to match SettingsCardFunctionality.js
  try {
    const result = await pool.query('INSERT INTO projects (main_project) VALUES ($1) RETURNING *', [project_name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a subproject (for admin)
app.post('/api/subprojects', async (req, res) => {
  const { mainProject, subProject } = req.body; // Changed to match SettingsCardFunctionality.js
  try {
    const projectResult = await pool.query('SELECT id FROM projects WHERE main_project = $1', [mainProject]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const project_id = projectResult.rows[0].id;
    const result = await pool.query(
      'INSERT INTO subprojects (project_id, sub_project) VALUES ($1, $2) RETURNING *',
      [project_id, subProject]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a project (for admin)
app.delete('/api/projects/:main_project', async (req, res) => {
  const { main_project } = req.params;
  try {
    const projectResult = await pool.query('DELETE FROM projects WHERE main_project = $1 RETURNING *', [main_project]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a subproject (for admin)
app.delete('/api/subprojects/:main_project/:sub_project', async (req, res) => {
  const { main_project, sub_project } = req.params;
  try {
    const projectResult = await pool.query('SELECT id FROM projects WHERE main_project = $1', [main_project]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    const project_id = projectResult.rows[0].id;
    const result = await pool.query(
      'DELETE FROM subprojects WHERE project_id = $1 AND sub_project = $2 RETURNING *',
      [project_id, sub_project]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subproject not found' });
    }
    res.json({ message: 'Subproject deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all labels
app.get('/api/labels', async (req, res) => {
  try {
    const result = await pool.query('SELECT label_name, color FROM labels');
    const labels = result.rows.reduce((acc, { label_name, color }) => {
      acc[label_name] = color;
      return acc;
    }, {});
    res.json(labels);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a label (for admin)
app.post('/api/labels', async (req, res) => {
  const { label_name, color } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO labels (label_name, color) VALUES ($1, $2) RETURNING *',
      [label_name, color]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a label (for admin)
app.delete('/api/labels/:label_name', async (req, res) => {
  const { label_name } = req.params;
  try {
    const result = await pool.query('DELETE FROM labels WHERE label_name = $1 RETURNING *', [label_name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Label not found' });
    }
    res.json({ message: 'Label deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all task types
app.get('/api/task-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT task_type FROM task_types');
    res.json(result.rows.map(row => row.task_type));
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a task type (for admin)
app.post('/api/task-types', async (req, res) => {
  const { task_type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO task_types (task_type) VALUES ($1) RETURNING *',
      [task_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a task type (for admin)
app.delete('/api/task-types/:task_type', async (req, res) => {
  const { task_type } = req.params;
  try {
    const result = await pool.query('DELETE FROM task_types WHERE task_type = $1 RETURNING *', [task_type]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task type not found' });
    }
    res.json({ message: 'Task type deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});