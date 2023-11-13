const sqlite3 = require('sqlite3').verbose();

// Open the database
const db = new sqlite3.Database('./mydb.sqlite3', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
        throw err; // Optionally, you can throw the error to halt the execution
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hash TEXT NOT NULL
        )`, (err) => {
            if (err) {
                // Table already created
                console.log('Table already exists.');
            } else {
                // Table just created, creating some rows
                console.log('Table created.');
            }
        });
    }
});

module.exports = db;
