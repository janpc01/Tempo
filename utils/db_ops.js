import sqlite3 from "sqlite3";

const filepath = "./database.db";

function createDbConnection() {
    const db = new sqlite3.Database(filepath, (error) => {
      if (error) {
        return console.error(error.message);
      }
    });
    console.log("Connection with SQLite has been established");
    return db;
}

function createUserTable(db) {
    // Create a table for users
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  email TEXT UNIQUE,
                  password TEXT
                )`, (err) => {
          if (err) {
            console.error('Error creating users table:', err.message);
          } else {
            console.log('Users table created successfully.');
          }
        });
      });
}

// delete record


// insert record


// select all records


// select record by id


// update record


// export functions
export {
    createDbConnection,
    createUserTable,
    // deleteRecord,
    // insertRecord,
    // selectAllRecords,
    // selectRecordById,
    // update
}
