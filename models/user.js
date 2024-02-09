// User.js
import sqlite3 from 'sqlite3';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

// User model
const User = {
    findByUsername: (username, callback) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    },
    findById: (id, callback) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    }
};

module.exports = User;
