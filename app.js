const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Allow dynamic port configuration for deployment

// Database connection configuration
const db = new Client({
    user: process.env.DB_USER || "postgres",      // Default to "postgres" if environment variable is not set
    host: process.env.DB_HOST || "localhost",    // Default to "localhost"
    database: process.env.DB_NAME || "portfolio_wafa_main", // Default to your database name
    password: process.env.DB_PASSWORD || "admin",// Default to "admin"
    port: process.env.DB_PORT || 5433            // Default to PostgreSQL's standard port
});

// Connect to the database
db.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to database:', err));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    

// Serve contact form (if you have an HTML form)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html')); // Make sure `form.html` exists in the root directory
});

// Handle form submission
app.post('/submit', async (req, res) => {
    console.log('POST /submit called with data:', req.body);
    const { name, email, message } = req.body;

    try {
        // Insert the form data into the database
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await db.query(query, [name, email, message]);

        res.send('<h1>Message sent successfully! Thank you for your submission.</h1>');
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.send('<h1>There was an error. Please try again later.</h1>');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
