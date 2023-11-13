const { body, validationResult } = require('express-validator');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Import the user model

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

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
      const hash = await bcrypt.hash(password, 10); // Hash the password
      User.createUser(username, hash); // Store user
      res.status(201).send('User created');
    } catch (error) {
      res.status(500).send('Error registering new user');
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
      const user = User.findUser(username);

      if (user && await bcrypt.compare(password, user.hash)) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      res.status(500).send('Error logging in');
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});