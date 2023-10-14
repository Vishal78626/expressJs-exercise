const express = require("express");
const groceriesRoute = require("./routes/groceries");
const marketRoute = require("./routes/markets");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRoute = require("./routes/auth");

const passport = require("passport");
// require('../src/strategies/local')
require('../src/strategies/discord') 
require("./database")


const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Specify extended: true
app.use(cookieParser());
app.use(session({
  secret: 'abcd',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/expressjs_tutorial'
  })
}));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api', groceriesRoute);
app.use('/api/market', marketRoute);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => console.log(`Express is running on port ${PORT}`));
