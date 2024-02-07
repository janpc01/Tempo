import express from "express";
import session from 'express-session';
import { User } from './models/user.js';
import { createDbConnection } from './utils/db_ops.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = createDbConnection();
const user = new User(db);

app.use(session({
    secret: process.env.API_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));
// Use middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware to check if the user is logged in
function requireLogin(req, res, next) {
    console.log(req.session.userId)
    if (req.session) {
        console.log("session active")
    }
    if (req.session && req.session.userId) {
        // User is logged in, redirect to the home page
        res.redirect('/dashboard');
    } else {
        // User is not logged in, redirect to the login page
        res.redirect('/login');
    }
}



// Home Page
app.get('/', requireLogin, (req, res) => {
    // This route will not be reached because the middleware will redirect based on login status
});

// Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/dashboard.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/register.html'));
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const result = await user.register(email, password);
    if (result.success) {
      res.redirect('/login');
    } else {
      res.redirect('/register');
    }
  });

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await user.login(email, password);
    if (result.success) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
