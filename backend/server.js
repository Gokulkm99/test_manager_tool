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

// Save or update user settings
app.post('/api/user-settings', async (req, res) => {
  const { user_id, greeting, name, mobile, email, designation, to_emails, cc_emails, redmine_api_key } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO user_settings (user_id, greeting, name, mobile, email, designation, to_emails, cc_emails, redmine_api_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (user_id)
       DO UPDATE SET greeting = $2, name = $3, mobile = $4, email = $5, designation = $6, to_emails = $7, cc_emails = $8, redmine_api_key = $9
       RETURNING *`,
      [user_id, greeting, name, mobile, email, designation, to_emails, cc_emails, redmine_api_key]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Proxy endpoint for Redmine API
app.get('/api/redmine/issues', async (req, res) => {
  const apiKey = req.headers['x-redmine-api-key'];
  if (!apiKey) {
    console.error('No Redmine API key provided in request headers');
    return res.status(400).json({ error: 'Redmine API key is required' });
  }

  try {
    console.log(`Sending request to Redmine with API key: ${apiKey.slice(0, 8)}...`);
    const response = await fetch(
      'http://agilescrummodel.com:3000/issues.json?assigned_to_id=me&set_filter=1&sort=priority%3Adesc%2Cupdated_on%3Adesc',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Redmine-API-Key': apiKey,
        },
      }
    );

    const contentType = response.headers.get('Content-Type');
    console.log(`Redmine response status: ${response.status}, Content-Type: ${contentType}`);

    if (!response.ok) {
      const text = await response.text();
      console.error(`Redmine error response: ${text.slice(0, 200)}...`);
      let errorMessage = `Redmine API error: ${response.status} ${response.statusText}`;
      if (response.status === 401) {
        errorMessage = 'Invalid Redmine API key. Please verify your API key in settings.';
      } else if (response.status === 500) {
        errorMessage = 'Redmine server error. Please contact the server administrator.';
      }
      return res.status(response.status).json({
        error: errorMessage,
        details: text.slice(0, 200),
      });
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`Invalid Redmine response format: ${text.slice(0, 200)}...`);
      return res.status(502).json({
        error: 'Invalid response format from Redmine: Expected JSON',
        details: text.slice(0, 200),
      });
    }

    const data = await response.json();
    console.log(`Redmine response received: ${data.issues ? data.issues.length : 0} issues`);
    res.json(data);
  } catch (err) {
    console.error('Redmine proxy error:', err.message);
    res.status(500).json({ error: 'Failed to fetch data from Redmine', details: err.message });
  }
});

// Get user settings
app.get('/api/user-settings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT greeting, name, mobile, email, designation, to_emails, cc_emails, redmine_api_key FROM user_settings WHERE user_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
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

// Get user settings
app.get('/api/user-settings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT greeting, name, mobile, email, designation, to_emails, cc_emails FROM user_settings WHERE user_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save or update user settings
app.post('/api/user-settings', async (req, res) => {
  const { user_id, greeting, name, mobile, email, designation, to_emails, cc_emails } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO user_settings (user_id, greeting, name, mobile, email, designation, to_emails, cc_emails)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id)
       DO UPDATE SET greeting = $2, name = $3, mobile = $4, email = $5, designation = $6, to_emails = $7, cc_emails = $8
       RETURNING *`,
      [user_id, greeting, name, mobile, email, designation, to_emails, cc_emails]
    );
    res.json(result.rows[0]);
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
  const { project_name } = req.body;
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
  const { mainProject, subProject } = req.body;
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

// Get all browsers (for QA Test Report)
app.get('/api/browsers', async (req, res) => {
  try {
    const result = await pool.query('SELECT browser_name FROM browsers');
    res.json(result.rows.map(row => row.browser_name));
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a browser (for admin)
app.post('/api/browsers', async (req, res) => {
  const { browser_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO browsers (browser_name) VALUES ($1) RETURNING *',
      [browser_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a browser (for admin)
app.delete('/api/browsers/:browser_name', async (req, res) => {
  const { browser_name } = req.params;
  try {
    const result = await pool.query('DELETE FROM browsers WHERE browser_name = $1 RETURNING *', [browser_name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Browser not found' });
    }
    res.json({ message: 'Browser deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all environments (for QA Test Report)
app.get('/api/environments', async (req, res) => {
  try {
    const result = await pool.query('SELECT environment_name FROM environments');
    res.json(result.rows.map(row => row.environment_name));
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add an environment (for admin)
app.post('/api/environments', async (req, res) => {
  const { environment_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO environments (environment_name) VALUES ($1) RETURNING *',
      [environment_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an environment (for admin)
app.delete('/api/environments/:environment_name', async (req, res) => {
  const { environment_name } = req.params;
  try {
    const result = await pool.query('DELETE FROM environments WHERE environment_name = $1 RETURNING *', [environment_name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Environment not found' });
    }
    res.json({ message: 'Environment deleted' });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all test types (for QA Test Report)
app.get('/api/test-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT test_type_name FROM test_types');
    res.json(result.rows.map(row => row.test_type_name));
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a test type (for admin)
app.post('/api/test-types', async (req, res) => {
  const { test_type_name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO test_types (test_type_name) VALUES ($1) RETURNING *',
      [test_type_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a test type (for admin)
app.delete('/api/test-types/:test_type_name', async (req, res) => {
  const { test_type_name } = req.params;
  try {
    const result = await pool.query('DELETE FROM test_types WHERE test_type_name = $1 RETURNING *', [test_type_name]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test type not found' });
    }
    res.json({ message: 'Test type deleted' });
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