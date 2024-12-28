import express from 'express';
import { Client } from 'pg';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'portfolio_wafa_main',
    password: process.env.DB_PASSWORD || 'admin',
    port: process.env.DB_PORT || 5433,
});

const connectToDB = async () => {
    try {
        await db.connect();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
};
connectToDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('<h1>All fields are required!</h1>');
    }

    try {
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await db.query(query, [name, email, message]);
        res.render('success', { name });
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).send('<h1>An error occurred while processing your request. Please try again later.</h1>');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
