import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

// Controller functions
const authController = {
    getLogin: (req, res) => {
        res.render('login');
    },
    postLogin: (req, res) => {
        const { username, password } = req.body;
        // Find user by username in the database
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err || !row || !bcrypt.compareSync(password, row.password)) {
                return res.status(401).send('Invalid username or password');
            }
            const user = { id: row.id, username: row.username };
            const token = generateToken(user);
            res.cookie('jwt', token, { httpOnly: true });
            res.redirect('/home');
        });
    },
    getRegister: (req, res) => {
        res.render('register');
    },
    postRegister: (req, res) => {
        const { username, email, password } = req.body;
        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);
        // Insert new user into the database
        db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err) {
            if (err) {
                return res.status(400).send('Error registering user');
            }
            const user = { id: this.lastID, username, email, password: hashedPassword };
            const token = generateToken(user);
            res.cookie('jwt', token, { httpOnly: true });
            res.redirect('/home');
        });
    },
    ensureAuthenticated: (req, res, next) => {
        const token = req.cookies.jwt;
        if (!token) {
            console.log('No token');
            return res.redirect('/login');
        }
        jwt.verify(token, process.env.API_KEY, (err, decoded) => {
            if (err) {
                console.log('Invalid token');
                return res.redirect('/login');
            }
            req.user = decoded;
            next();
        });
    },
    getHome: (req, res) => {
        res.render('home', { username: req.user.username });
    }
};

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.API_KEY, { expiresIn: '1h' });
}

export default authController;