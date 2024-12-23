const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

const dotenv = require('dotenv');
// Load environment variables from root folder (one dir up)
dotenv.config({ path: '../.env' });

// Routes
const loginRouter = require('./routes/login');
const bookmarksRouter = require('./routes/bookmarks');


const app = express();

const PORT = process.env.PORT || 3000;

// Session middleware before any routes
app.use(session({
  secret: 'trajanA4MostSecretKeyEver', // A secret key used to sign the session ID cookie (choose a strong secret key)
  resave: false,             // Forces the session to be saved back to the session store, even if it's not modified.
  saveUninitialized: false, // Don't save uninitialized sessions (important for security)
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Session expiry time (1 day in this case)
  },
}));

// CORS middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// serve routes
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
