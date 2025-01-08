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

// Database connection setup
const db = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'portfolio_wafa_main',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5433,
});

// Connect to the database
const connectToDB = async () => {
    try {
        await db.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Error connecting to database:', err);
        process.exit(1); // Exit process if the database connection fails
    }
};
connectToDB();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static files
app.use(express.static(path.join(process.cwd(), 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'form.html'));
});

app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate form data
    if (!name || !email || !message) {
        return res.status(400).send('<h1>All fields are required!</h1>');
    }

    try {
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await db.query(query, [name, email, message]);
        res.render('success', { name }); // Render a success page using EJS
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).send('<h1>An error occurred while processing your request. Please try again later.</h1>');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
