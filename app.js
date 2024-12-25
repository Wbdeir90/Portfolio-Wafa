const express = require('express');
const { Client } = require('pg'); 
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();  // Loads environment variables from .env file

const app = express();
const port = 3000;

// Database connection configuration
const db = new Client({
    user: process.env.DB_USER || "postgres",  // Use environment variable for DB user or default to "postgres"
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "portfolio_wafa_main",  // Ensure your DB name matches
    password: process.env.DB_PASSWORD || "admin",  // Use environment variable or default password
    port: process.env.DB_PORT || 5433,  // Default to PostgreSQL port
});

// Connect to the database
db.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to database', err));

// Middleware to parse incoming form data (urlencoded and JSON)
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files like CSS, images

// Serve the contact form (form.html) as the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));  // Ensure form.html is in the root directory
});

// Handle form submission
app.post('/submit', async (req, res) => {
    console.log('Received POST request to /submit');
    console.log('Form data:', req.body);

    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        console.log('Missing required form fields');
        return res.send('<h1>All fields are required. Please fill out the form completely.</h1>');
    }

    try {
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await db.query(query, [name, email, message]);

        res.send('<h1>Message sent successfully! Thank you for your submission.</h1>');
    } catch (err) {
        console.error('Error inserting data into database', err);
        res.send('<h1>There was an error. Please try again later.</h1>');
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
