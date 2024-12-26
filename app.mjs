import express from 'express';
import pkg from 'pg';  // Import 'pg' as 'pkg'
const { Client } = pkg;  // Extract 'Client' from 'pkg'
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv'; // Load environment variables from .env file

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Allow dynamic port configuration for deployment

// Initialize PostgreSQL client
const client = new Client({
    host: 'localhost',
    port: 5433,
    user: 'postgres',       // replace with your PostgreSQL user
    password: 'admin',      // replace with your PostgreSQL password
    database: 'portfolio_wafa_main',  // replace with your actual database name
});

client.connect()
    .then(() => {
        console.log("Connected to PostgreSQL");
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    });

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views'); // Optional: specify views folder

// Serve static files from the 'public' directory
const __dirname = path.resolve();  // Fix for ES module environment to get the current directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const normalizedPath = path.join(__dirname, 'form.html');
    res.sendFile(normalizedPath); // Serve the contact form
});

// Handle form submission
app.post('/submit', async (req, res) => {
    console.log('POST /submit called with data:', req.body);
    const { name, email, message } = req.body;

    try {
        // Insert the form data into the database
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await client.query(query, [name, email, message]);

        // Send a response with a personalized message
        res.send(`
            <h1>Message sent successfully!</h1>
            <p>Thank you for your submission, ${name}.</p>
        `);
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.send('<h1>There was an error. Please try again later.</h1>');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
