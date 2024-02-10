-- SQLBook: Code
CREATE TABLE IF NOT EXISTS days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    date DATE NOT NULL,
    completed INT NOT NULL,
    FOREIGN KEY(habit_id) REFERENCES habits(id)
    ON DELETE CASCADE
);