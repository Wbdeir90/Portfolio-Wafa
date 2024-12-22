const express = require('express');
const { Client } = require('pg'); // Import the Client class from pg
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// Database connection
const db = new Client({
    user: "postgres",
    host: "localhost",
    database: "portfolio_wafa_main",
    password: "admin",
    port: 5433,
});

db.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to database', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // For static files like CSS, images

// Set up view engine (EJS) if you plan to use dynamic HTML pages
app.set('view engine', 'ejs');

// Serve form.html as the landing page (contact form)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));  // Ensure form.html exists in the root
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Insert data into PostgreSQL database
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await db.query(query, [name, email, message]);

        // Respond with a success message or redirect
        res.send('<h1>Message sent successfully! Thank you for your submission.</h1>');
    } catch (err) {
        console.error('Error inserting data into database', err);
        res.send('<h1>There was an error. Please try again later.</h1>');
    }
});

console.log(process.env.DB_PASSWORD); // Should print 'admin'
// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
