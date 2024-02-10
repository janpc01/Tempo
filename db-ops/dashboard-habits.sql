CREATE TABLE IF NOT EXISTS dashboard_habits (
    dashboard_id INTEGER NOT NULL,
    habit_id INTEGER NOT NULL,
    PRIMARY KEY (dashboard_id, habit_id),
    FOREIGN KEY(dashboard_id) REFERENCES dashboards(id) ON DELETE CASCADE,
    FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE
);
