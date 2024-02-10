// Dashboard.js
import sqlite3 from 'sqlite3';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

// Dashboard model
const Dashboard = {
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

export default Dashboard;
