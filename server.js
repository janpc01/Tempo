import express from "express";
import session from 'express-session';
import { User } from './models/user.js';
import { Habit } from './models/habit.js';
import { createDbConnection, createUserTable, createDaysTable, createHabitTable } from './utils/db_ops.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// set up tables
const db = createDbConnection();

// set the view engine to ejs
app.set('view engine', 'ejs');

// set up models
const user = new User(db);
const habit = new Habit(db);
createUserTable(db);
createHabitTable(db);
createDaysTable(db);

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
    var habits = habit.fetchHabits(req.session.userId);
    res.render('pages/dashboard', { habits: habits });
});

// Sign up
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/register.html'));
});

// POST for registering
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
    res.render('pages/login');
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
