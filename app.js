const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

const { Pool } = require('pg'); // Import PostgreSQL client
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files like CSS and JS
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Configure PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the PostgreSQL connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL');
    release();
});

// Route to display the homepage with all blog posts
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY date DESC');
        res.render('index', { posts: result.rows });
    } catch (err) {
        console.error('Error fetching posts:', err.stack);
        res.render('error', { message: 'Failed to fetch posts' });
    }
});

// Route to create a new blog post
app.get('/new-post', (req, res) => {
    res.render('new-post');
});

// Handle form submission for new blog post
app.post('/new-post', async (req, res) => {
    const { title, content } = req.body;
    try {
        await pool.query('INSERT INTO posts (title, content) VALUES ($1, $2)', [title, content]);
        res.redirect('/');
    } catch (err) {
        console.error('Error creating a new post:', err.stack);
        res.render('error', { message: 'Failed to create a new post' });
    }
});

// Example API call: Fetch data from an external API (e.g., weather data)
app.get('/weather', (req, res) => {
    const city = req.query.city || 'London'; // Default to London if no city is provided
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`;

    axios.get(apiUrl)
        .then(response => {
            const weatherData = response.data;
            // Pass the weather data to your EJS template
            res.render('weather', { weather: weatherData });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            res.render('error', { message: 'Failed to fetch weather data' });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
