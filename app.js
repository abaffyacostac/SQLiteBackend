const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  
const db = require('./db/database');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());  // Enable CORS

// Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.run(query, [name, email], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(201).send({ id: this.lastID });
    });
});

// Read all users
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).json(rows);
    });
});

// Read a single user by id
app.get('/users/:id', (req, res) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const { id } = req.params;
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!row) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(row);
    });
});

// Update a user by id
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.run(query, [name, email, id], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (this.changes === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User updated successfully');
    });
});

// Delete a user by id
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (this.changes === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).send('User deleted successfully');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
