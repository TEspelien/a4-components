const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const loginRouter = require('./routes/login');
const bookmarksRouter = require('./routes/bookmarks');

app.use('/login', loginRouter);
app.use('/bookmarks', bookmarksRouter);

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback route to serve the login page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
