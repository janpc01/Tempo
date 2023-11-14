const sqlite3 = require('sqlite3').verbose();

// Open the database
const db = new sqlite3.Database('./mydb.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
        throw err; // Optionally, you can throw the error to halt the execution
    } else {
        console.log('Connected to the SQLite database.');

        // Create Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hash TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating users table', err.message);
            } else {
                console.log('Users table created or already exists.');
            }
        });

        // Create Habits Table
        db.run(`CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            habit_name TEXT NOT NULL,
            description TEXT,
            creation_date DATE NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`, (err) => {
            if (err) {
                console.error('Error creating habits table', err.message);
            } else {
                console.log('Habits table created or already exists.');
            }
        });

        // Create Habit Tracking Table
        db.run(`CREATE TABLE IF NOT EXISTS habit_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            habit_id INTEGER NOT NULL,
            date DATE NOT NULL,
            status BOOLEAN NOT NULL,
            notes TEXT,
            FOREIGN KEY (habit_id) REFERENCES habits (id)
        )`, (err) => {
            if (err) {
                console.error('Error creating habit_tracking table', err.message);
            } else {
                console.log('Habit tracking table created or already exists.');
            }
        });
    }
});

module.exports = db;
