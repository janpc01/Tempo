// habit.js

class Habit {
    constructor(db) {
        this.db = db;
    }

    async createHabit(userId, habitName) {
        try {
            await this.db.run('INSERT INTO habits (user_id, habit_name, current_streak, longest_streak) VALUES (?, ?, ?, ?)', [userId, habitName, 0, 0]);
            return { success: true, message: 'Habit created successfully' };
        } catch (error) {
            console.error('Failed to create habit:', error);
            return { success: false, message: 'Failed to create habit' };
        }
    }

    async deleteHabit(userId, habitId) {
        try {
            await this.db.run('DELETE FROM habits WHERE user_id = ? AND id = ?', [userId, habitId]);
            return { success: true, message: 'Habit deleted successfully' };
        } catch (error) {
            console.error('Failed to delete habit:', error);
            return { success: false, message: 'Failed to delete habit' };
        }
    }

    async getHabits(userId) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM habits WHERE user_id = ?', [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async fetchHabits(userId) {
        try {
            console.log(userId);
            const habits = await this.getHabits(userId);
            console.log(habits); // This will log the habits data
            // You can further process the habits data here
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    }

    async markDay(habitId, date, completed) {
        try {
            // delete any row with the same date and habit_id
            await this.db.run('DELETE FROM days WHERE date = ? AND habit_id = ?', [date, habitId]);
            await this.db.run('INSERT INTO days (date, habit_id, completed) VALUES (?, ?, ?)', [date, habitId, completed]);
            return { success: true, message: 'Day marked successfully' };
        } catch (error) {
            console.error('Failed to mark day:', error);
            return { success: false, message: 'Failed to mark day' };
        }
    }

    async getDayCompleted(habitId, date) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT completed FROM days WHERE date = ? AND habit_id = ?', [date, habitId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

export { Habit };
