// Day.js
import sqlite3 from 'sqlite3';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

class Day {
    constructor(habitId, date, completed) {
        this.habitId = habitId;
        this.date = date;
        this.completed = completed;
    }

    getDay() {
        return this.date;
    }

    getCompleted() {
        return this.completed;
    }
}

// Day model
const DayOps = {
    createToday: (habitId, callback) => {
        const date = new Date().toISOString().slice(0, 10);
        db.run('INSERT INTO days (habit_id, date, completed) VALUES (?, ?, 0)', [habitId, date], function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    updateDay: (habitId, day, completed, callback) => {
        const completedString = completed ? "TRUE" : "FALSE";
        db.run('UPDATE days SET completed = ? WHERE habit_id = ? AND date = ?', [completedString, habitId, day], 
        function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    getDay: (habitId, day, callback) => {
        db.get('SELECT * FROM days WHERE habit_id = ? AND date = ?', [habitId, day], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    },
    getDaysByHabitId: (habitId, callback) => {
        db.all('SELECT * FROM days WHERE habit_id = ?', [habitId], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, rows);
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
