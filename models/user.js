// user.js

import bcrypt from 'bcrypt';

class User {
    constructor(db) {
        this.db = db;
    }

    async register(username, password) {
        try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        await this.db.run('INSERT INTO users (email, password) VALUES (?, ?)', [username, hashedPassword]);
        return { success: true, message: 'User registered successfully' };
        } catch (error) {
        console.error('Failed to register user:', error);
        return { success: false, message: 'Failed to register user' };
        }
    }

    async login(username, password) {
        try {
        const user = await this.getUserByUsername(username);
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (bcrypt.compareSync(password, user.password)) {
            return { success: true, message: 'Login successful' };
        } else {
            return { success: false, message: 'Invalid password' };
        }
        } catch (error) {
        console.error('Failed to login:', error);
        return { success: false, message: 'Failed to login' };
        }
    }

    async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
        this.db.get('SELECT * FROM users WHERE email = ?', [username], (err, row) => {
            if (err) {
            reject(err);
            } else {
            resolve(row);
            }
        });
        });
    }
}

export { User };
