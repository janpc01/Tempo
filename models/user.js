// User.js
import sqlite3 from 'sqlite3';
import { Dashboard, DashboardOps } from './dashboard.js';

// Connect to SQLite database
const db = new sqlite3.Database('./database.db');

class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
    }

    async load() {
        try {
            this.dashboards = await this.generateDashboards();
            for (var i = 0; i < this.dashboards.length; i++) {
                await this.dashboards[i].load();
            }
        } catch (error) {
            throw error;
        }
    }

    generateDashboards() {
        return new Promise((resolve, reject) => {
            var dashboardsArr = [];
            DashboardOps.getDashboardsByUserId(this.id, (err, dashboards) => {
                if (err) {
                    reject(err);
                } else {
                    dashboards.forEach((dashboard) => {
                        dashboardsArr.push(new Dashboard(dashboard.id, dashboard.user_id, dashboard.name));
                    });
                    resolve(dashboardsArr);
                }
            });
        });
    }
    
    getDashboards() {
        return this.dashboards;
    }

    getUsername() {
        return this.username;
    }

    isLoaded() {
        return this.loaded;
    }
}

// User operations
const UserOps = {
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
            DashboardOps.createNewDashboard(this.lastID, 'Main', (err) => {
                if (err) {
                    return callback(err, null);
                }
            });
            return callback(null, this.lastID);
        });
    }
};

export { User, UserOps };
