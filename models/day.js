// Day.js
import sqlite3 from 'sqlite3';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

class Day {
    constructor(habitId, day, completed) {
        this.habitId = habitId;
        this.day = day;
        this.completed = completed;
    }
}

// Day model
const DayOps = {
    createToday: (habitId, callback) => {
        const date = new Date().toISOString().slice(0, 10);
        db.run('INSERT INTO days (habit_id, day, completed) VALUES (?, ?, 0)', [habitId, date], function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    updateDay: (habitId, day, completed, callback) => {
        const completedString = completed ? "TRUE" : "FALSE";
        db.run('UPDATE days SET completed = ? WHERE habit_id = ? AND day = ?', [completedString, habitId, day], 
        function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    getDay: (habitId, day, callback) => {
        db.get('SELECT * FROM days WHERE habit_id = ? AND day = ?', [habitId, day], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    },
    deleteHabitDays: (habitId, callback) => {
        db.run('DELETE FROM days WHERE habit_id = ?', [habitId], function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
};

export { Day, DayOps };
