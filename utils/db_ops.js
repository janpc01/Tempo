import sqlite3 from "sqlite3";

const filepath = "./database.db";

function createDbConnection() {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    });
    console.log("Connection with SQLite has been established");
    return db;
}

function createUserTable(db) {
    // Create a table for users
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  email TEXT UNIQUE,
                  password TEXT
                )`, (err) => {
          if (err) {
            console.error('Error creating users table:', err.message);
          } else {
            console.log('Users table created successfully.');
          }
        });
    });
}

function createHabitTable(db) {
    // Create a table for habits
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS habits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                habit_name TEXT,
                current_streak INTEGER,
                longest_streak INTEGER,
                FOREIGN KEY(user_id) REFERENCES users(id)
                )`, (err) => {
        if (err) {
            console.error('Error creating habits table:', err.message);
        } else {
            console.log('Habits table created successfully.');
        }
        });
    });
}

function createDaysTable(db) {
    // Create a table for each day
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS days (
                day_id INTEGER PRIMARY KEY AUTOINCREMENT,
                date DATE,
                habit_id INTEGER,
                completed BOOLEAN,
                FOREIGN KEY(habit_id) REFERENCES habits(id)
                )`, (err) => {
        if (err) {
            console.error('Error creating days table:', err.message);
        } else {
            console.log('Days table created successfully.');
        }
        });
    });
}

function wipeData(db) {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS users`);
        db.run(`DROP TABLE IF EXISTS habits`);
        db.run(`DROP TABLE IF EXISTS days`);
    });
}

// export functions
export {
    createDbConnection,
    createUserTable,
    createHabitTable,
    createDaysTable,
    wipeData
}
