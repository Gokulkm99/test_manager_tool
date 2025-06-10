const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'caparizon_db',
  password: 'mysecurepassword',
  port: 5432,
});

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const updatePasswords = async () => {
  const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' },
  ];

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashedPassword, user.username]);
    console.log(`Updated password for ${user.username}`);
  }

  await pool.end();
  console.log('Done');
};

updatePasswords().catch(err => console.error(err.stack));