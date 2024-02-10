// Habit.js
import sqlite3 from 'sqlite3';
import Day from './day.js';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

// Habit model
const Habit = {
    createNewHabit: (userId, name, callback) => {
        db.run(
            'INSERT INTO habits (user_id, name, current_streak, longest_streak) VALUES (?, ?, 0, 0)', 
            [userId, name], 
            function(err) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, this.lastID);
        });
    },
    getHabitsByUserId: (userId, callback) => {
        db.all('SELECT * FROM habits WHERE user_id = ?', [userId], (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, rows);
        });
    },
    getHabitById: (habitId, callback) => {
        db.get('SELECT * FROM habits WHERE id = ?', [habitId], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    },
    changeHabitName: (habitId, newName, callback) => {
        db.run('UPDATE habits SET name = ? WHERE id = ?', [newName, habitId], function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    deleteHabit: (habitId, callback) => {
        db.run('DELETE FROM habits WHERE id = ?', [habitId], function(err) {
            if (err) {
                return callback(err);
            }
            Day.deleteHabitDays(habitId, (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
            return callback(null);
        });
    },
};

export default Habit;
