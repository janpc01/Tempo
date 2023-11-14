require('dotenv').config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const db = require('./database.js');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const express = require('express');
app.use(express.json());
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Import the user model



app.get('/', (req, res) => {
  res.send('Welcome to the Habit Tracker API!');
});

app.get('/dashboard', (req, res) => {
  if (!req.query.username) {
    return res.status(400).send('Username is required');
  }
  res.send(`<h1>${req.query.username}'s Dashboard</h1>`);
});

// Middleware
const app = express();
const port = process.env.PORT
app.use(express.json());
app.use(express.static('public'));

// Register User
app.post('/register',
  // Validation rules as middleware
  body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),

  // Route handler
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      // Check if username already exists
      const checkUserSql = `SELECT username FROM users WHERE username = ?`;
      db.get(checkUserSql, [username], async (err, row) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send('Error checking user');
        }
        if (row) {
          return res.status(409).send('Username already exists'); // 409 Conflict
        }

        // If username does not exist, proceed with registration
        const hash = await bcrypt.hash(password, 10);
        const insertSql = `INSERT INTO users (username, hash) VALUES (?, ?)`;
        db.run(insertSql, [username, hash], function (err) {
          if (err) {
            console.error(err.message);
            return res.status(500).send('Error registering new user');
          }
          res.status(201).send(`User created with ID: ${this.lastID}`);
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

// User Login
app.post('/login',
  // Validation rules as middleware
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),

  // Route handler
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], async (err, user) => {
        if (err) {
          return res.status(500).send('Error logging in');
        }
        if (user && await bcrypt.compare(password, user.hash)) {
          const token = jwt.sign({ username: user.username }, jwtSecretKey, { expiresIn: '1h' });
          res.json({ token });
        } else {
          res.status(401).send('Invalid credentials');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in');
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});