// Habit.js
import sqlite3 from 'sqlite3';
import { Day, DayOps } from './day.js';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

class Habit {
    constructor(id, userId, name, currentStreak, longestStreak) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.days = [];
    }

    async load() {
        try {
            this.days = await this.generateDays();
        } catch (error) {
            throw error;
        }
    }

    generateDays() {
        return new Promise((resolve, reject) => {
            var daysArr = [];
            DayOps.getDaysByHabitId(this.id, (err, days) => {
                if (err) {
                    reject(err);
                } else {
                    days.forEach((day) => {
                        daysArr.push(new Day(day.id, day.date, day.completed));
                    });
                    resolve(daysArr);
                }
            });
        });
    }
    
    getDays() {
        return this.days;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getCurrentStreak() {
        return this.currentStreak;
    }

    getLongestStreak() {
        return this.longestStreak;
    }
}

// Habit ops
const HabitOps = {
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
    getHabitsByDashboardId: (dashboardId, callback) => {
        db.all(
            'SELECT * FROM habits WHERE id IN (SELECT habit_id FROM dashboard_habits WHERE dashboard_id = ?)', 
            [dashboardId], 
            (err, rows) => {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, rows);
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
            DayOps.deleteHabitDays(habitId, (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
            return callback(null);
        });
    },
};

export { Habit, HabitOps };
