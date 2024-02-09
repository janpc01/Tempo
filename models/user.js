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
    createNewUser: (username, email, password, callback) => {
        db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], function(err) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, this.lastID);
        });
    }
};

export default User;
