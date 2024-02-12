import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserOps } from '../models/user.js';

dotenv.config();

// Controller functions
const authController = {
    getHome: (req, res) => {
        const token = req.cookies.jwt;
        if (!token) {
            return res.redirect('/login');
        }
        jwt.verify(token, process.env.API_KEY, (err, decoded) => {
            if (err) {
                console.log('Invalid token');
                return res.redirect('/login');
            }
            req.user = decoded;
            res.redirect('/dashboard');
        });
    },
    getLogin: (req, res) => {
        res.render('login');
    },
    postLogin: (req, res) => {
        const { username, password } = req.body;
        // Find user by username in the database
        UserOps.findByUsername(username, (err, row) => {
            if (err || !row || !bcrypt.compareSync(password, row.password)) {
                return res.status(401).send('Invalid username or password');
            }
            const user = { id: row.id, username: row.username };
            const token = generateToken(user);
            res.cookie('jwt', token, { httpOnly: true });
            res.redirect('/dashboard');
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
        UserOps.createNewUser(username, email, hashedPassword, (err, userId) => {
            if (err) {
                return res.status(400).send('Error registering user');
            }
            const user = { id: userId, username, email, password: hashedPassword };
            const token = generateToken(user);
            res.cookie('jwt', token, { httpOnly: true });
            res.redirect('/dashboard');
        });
    },
    ensureAuthenticated: (req, res, next) => {
        const token = req.cookies.jwt;
        if (!token) {
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
    getLogout: (req, res) => {
        res.clearCookie('jwt');
        res.redirect('/login');
    }
};

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.API_KEY, { expiresIn: '1h' });
}

export default authController;