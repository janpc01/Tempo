// Dashboard.js
import sqlite3 from 'sqlite3';
import { Habit, HabitOps } from './habit.js';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

class Dashboard {
    constructor(id, userId, name) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.habits = new Array();
    }

    async load() {
        try {
            this.habits = await this.generateHabits();
            for (var i = 0; i < this.habits.length; i++) {
                await this.habits[i].load();
            }
        } catch (error) {
            throw error;
        }
    }

    generateHabits() {
        return new Promise((resolve, reject) => {
            var habitsArr = [];
            HabitOps.getHabitsByDashboardId(this.id, (err, habits) => {
                if (err) {
                    reject(err); // Reject the promise with the error
                } else {
                    habits.forEach((habit) => {
                        habitsArr.push(new Habit(habit.id, habit.user_id, habit.name, habit.current_streak, habit.longest_streak));
                    });
                    resolve(habitsArr); // Resolve the promise with the array of habits
                }
            });
        });
    }
    
    getHabits() {
        return this.habits;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getHabit(habitName) {
        for (var i = 0; i < this.habits.length; i++) {
            if (this.habits[i].getName() === habitName) {
                return this.habits[i];
            }
        }
        return null;
    }
}

// Dashboard ops
const DashboardOps = {
    getDashboardsByUserId: (userId, callback) => {
        db.all('SELECT * FROM dashboards WHERE user_id = ?', [userId], (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(null, rows);
        });
    },
    getDashboardById: (dashboardId, callback) => {
        db.get('SELECT * FROM dashboards WHERE id = ?', [dashboardId], (err, row) => {
            if (err) {
                return callback(err);
            }
            return callback(null, row);
        });
    },
    createNewDashboard: (userId, name, callback) => {
        db.run('INSERT INTO dashboards (user_id, name) VALUES (?, ?)', [userId, name], (err) => {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    changeDashboardName: (dashboardId, newName, callback) => {
        db.run('UPDATE dashboards SET name = ? WHERE id = ?', [newName, dashboardId], (err) => {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    deleteDashboard: (dashboardId, callback) => {
        db.run('DELETE FROM dashboards WHERE id = ?', [dashboardId], (err) => {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    addHabitToDashboard: (dashboardId, habitId, callback) => {
        db.run('INSERT INTO dashboard_habits (dashboard_id, habit_id) VALUES (?, ?)', [dashboardId, habitId], (err) => {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
    deleteRelatedHabits: (dashboardId, callback) => {
        db.run('DELETE FROM dashboard_habits WHERE dashboard_id = ?', [dashboardId], (err) => {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    },
};

export { Dashboard, DashboardOps };
