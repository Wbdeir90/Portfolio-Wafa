import express from 'express';
import { Client } from 'pg';
import bodyParser from 'body-parser';
import path from 'path';
import React from 'react';

import dotenv from 'dotenv'; // Load environment variables from .env file

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Allow dynamic port configuration for deployment

// Database connection configuration
const db = new Client({
    user: process.env.DB_USER || 'postgres',      // Default to "postgres" if environment variable is not set
    host: process.env.DB_HOST || 'localhost',    // Default to "localhost"
    database: process.env.DB_NAME || 'portfolio_wafa_main', // Default to your database name
    password: process.env.DB_PASSWORD || 'admin', // Default to "admin"
    port: process.env.DB_PORT || 5433            // Default to PostgreSQL's standard port
});

// Connect to the database
const connectToDB = async () => {
    try {
        await db.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
};
connectToDB(); // Call the async function to connect

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views'); // Optional: specify views folder
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Serve contact form (if you have an HTML form)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html')); // Make sure `form.html` exists in the root directory
});

// Handle form submission
app.post('/submit', async (req, res) => {
    console.log('POST /submit called with data:', req.body);
    const { name, email, message } = req.body;

    // Validate the input
    if (!name || !email || !message) {
        return res.status(400).send('<h1>All fields are required!</h1>');
    }

    // Insert the form data into the database
    try {
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await db.query(query, [name, email, message]);

        // Success response
        res.render('success', { name });
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).send('<h1>An error occurred while processing your request. Please try again later.</h1>');
    }
});

function App() {
    return (
      <div className="App">
        <h1>Hello, React!</h1>
      </div>
    );
  }
  
  export default App;
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
