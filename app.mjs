import express from 'express';
import pkg from 'pg';
const { Client } = pkg;
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Manually define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Database connection setup using environment variables
const db = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'portfolio_wafa_main',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5433,
});

// Function to connect to the database
const connectToDB = async () => {
    try {
        await db.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
};
connectToDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Updated path to views folder
app.use(express.static(path.join(__dirname, 'public')));  // Serving static files from public folder

// Route to render the contact form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));  // Serve the contact form HTML
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    // Check if all fields are filled out
    if (!name || !email || !message) {
        return res.status(400).send('<h1>All fields are required!</h1>');
    }

    try {
        // Insert form data into the database
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await db.query(query, [name, email, message]);

        // Render success page after submission
        res.render('success', { name });
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).send('<h1>An error occurred while processing your request. Please try again later.</h1>');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
