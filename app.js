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

// Store blog posts (won't persist on server restart)
let posts = [];

// Route to display the homepage with all blog posts
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// Route to create a new blog post
app.get('/new-post', (req, res) => {
    res.render('new-post');
});

// Handle form submission for new blog post
app.post('/new-post', (req, res) => {
    const { title, content } = req.body;
    const newPost = { title, content, date: new Date() };
    posts.push(newPost);
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
