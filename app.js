const express = require('express');
const bodyParser = require('body-parser');
const expressSanitizer = require('express-sanitizer');
const methodOverride = require('method-override');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./db');
const { setPassport } = require('./passport');
const { setLocals } = require('./middlewares/sessionMiddleware');
const { commentRoutes, campgroundRoutes, homeRoutes, userRoutes } = require('./routes');
const { errorHandlingMiddleware } = require('./middlewares/errorHandlingMiddleware');

const flash = require('express-flash');


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Set up session and passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
setPassport(app);

// Set locals
app.use(setLocals);

// set error handling middleware
app.use(flash());
app.use(errorHandlingMiddleware);

// Set up view engine
app.use(express.static('static'));
app.set('view engine', 'ejs');

// Use routes
app.use(homeRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
