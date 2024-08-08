const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
//const db = new sqlite3.Database(':memory:');

// Create a new database file or open an existing one
const db = new sqlite3.Database('./db/mydatabase.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create a "users" table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
    )`);
});

module.exports = db;
