const path = require ('path')
const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const connectDB = require("./config/db")

// load config
dotenv.config()

// Passport config
require('./config/passport')(passport)

connectDB().then()

const app = express();

// logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'beermeister',
    resave: false,
    saveUnitialized: false,
}))

// Passport middleware
app.use(passport.initialize(undefined))
app.use(passport.session(undefined))

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
