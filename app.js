const path = require ('path')
const dotenv = require('dotenv')
const express = require('express')
const mongoose = require("mongoose")
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require("./config/db")

// load config
dotenv.config()

// Passport config
require('./config/passport')(passport)

connectDB().then()

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars helpers
const { formatDate, truncate, stripTags } = require('./helpers/hbs')

// handlebars
app.engine('.hbs', exphbs({
    helpers: {formatDate, truncate, stripTags},
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
    secret: 'beermeister',
    resave: false,
    saveUnitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
