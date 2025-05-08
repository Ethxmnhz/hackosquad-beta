import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const { Pool } = pg;

// Database configuration
const pool = new Pool({
  user: 'offic',
  host: 'localhost',
  database: 'hackosquad',
  password: 'minhaz123',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Test database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit if database connection fails
  } else {
    console.log('Successfully connected to database');
    done();
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, role, points) 
       VALUES ($1, $2, $3, 'user', 0) 
       RETURNING id, email, display_name, role, points, created_at`,
      [email, hashedPassword, displayName]
    );
    
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret');
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret');
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add verify token endpoint
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, display_name, role, points, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );
    
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Challenge routes
app.post('/api/challenges', authenticateToken, async (req, res) => {
  const { title, description, category, difficulty, points, flag, targetUrl, icon, hints } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO challenges (title, description, category, difficulty, points, flag, created_by, target_url, icon) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [title, description, category, difficulty, points, flag, req.user.userId, targetUrl, icon]
    );
    
    const challenge = result.rows[0];
    
    // Insert hints if provided
    if (hints && hints.length > 0) {
      for (const hint of hints) {
        await pool.query(
          'INSERT INTO hints (challenge_id, content) VALUES ($1, $2)',
          [challenge.id, hint]
        );
      }
    }
    
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/challenges', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.display_name as creator_name, 
             array_agg(h.content) as hints,
             (SELECT COUNT(*) FROM solved_challenges sc WHERE sc.challenge_id = c.id) as solved_count
      FROM challenges c
      LEFT JOIN users u ON c.created_by = u.id
      LEFT JOIN hints h ON c.id = h.challenge_id
      WHERE c.approved = true
      GROUP BY c.id, u.display_name
      ORDER BY c.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/challenges/created', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, array_agg(h.content) as hints,
             (SELECT COUNT(*) FROM solved_challenges sc WHERE sc.challenge_id = c.id) as solved_count
      FROM challenges c
      LEFT JOIN hints h ON c.id = h.challenge_id
      WHERE c.created_by = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [req.user.userId]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/challenges/:id/solve', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { flag } = req.body;

  try {
    // Get challenge and verify flag
    const challengeResult = await pool.query('SELECT * FROM challenges WHERE id = $1', [id]);
    const challenge = challengeResult.rows[0];

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    if (challenge.flag !== flag) {
      return res.status(400).json({ error: 'Incorrect flag' });
    }

    // Check if already solved
    const solvedResult = await pool.query(
      'SELECT * FROM solved_challenges WHERE user_id = $1 AND challenge_id = $2',
      [req.user.userId, id]
    );

    if (solvedResult.rows.length > 0) {
      return res.status(400).json({ error: 'Challenge already solved' });
    }

    // Record solve and update user points
    await pool.query('BEGIN');
    await pool.query(
      'INSERT INTO solved_challenges (user_id, challenge_id) VALUES ($1, $2)',
      [req.user.userId, id]
    );
    await pool.query(
      'UPDATE users SET points = points + $1 WHERE id = $2',
      [challenge.points, req.user.userId]
    );
    await pool.query('COMMIT');

    res.json({ message: 'Challenge solved successfully!', points: challenge.points });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(400).json({ error: error.message });
  }
});

// Start server with error handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});