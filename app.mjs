import express from 'express';
import pkg from 'pg';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pkg;
const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'portfolio_wafa_main',
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Database Connection Error:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/submit', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const query = 'INSERT INTO contact_form (name, email, message) VALUES ($1, $2, $3)';
        await client.query(query, [name, email, message]);
        res.send(`
            <html>
                <body>
                    <h1>Message sent successfully!</h1>
                    <p>Thank you for your submission, ${name}.</p>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).send('<h1>There was an error. Please try again later.</h1>');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
