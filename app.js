const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files like CSS and JS
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Sample user data for portfolio
const userData = {
    userName: 'Wafa Bdeir',
    tagline: 'A passionate software engineer and developer.',
    aboutMe: 'I have a strong background in software development, with experience in various programming languages and tools.',
    education: [
        { degree: 'Master of Science in Computer Science', institution: 'Oakland University', period: '2022-2024' },
        { degree: 'Bachelor of Science in Computer Graphics and Animation', institution: 'Princess Sumaya University', period: '2008-2012' }
    ],
    experience: [
        {
            role: 'Teaching Assistant',
            company: 'Oakland University',
            period: '2023-2024',
            tasks: ['Guided undergraduate students in programming languages', 'Assisted with final projects', 'Designed workshops to enhance learning']
        },
        {
            role: 'Software Engineer Intern',
            company: 'Tech Solutions Inc.',
            period: '2021-2022',
            tasks: ['Developed and maintained web applications', 'Collaborated with cross-functional teams', 'Implemented test automation scripts']
        }
    ],
    contact: {
        email: 'wafa@example.com',
        linkedin: 'https://www.linkedin.com/in/wafabdeir'
    }
};

// Route to serve the portfolio page
app.get('/', (req, res) => {
    res.render('portfolio', userData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
