if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();

const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const methodOverride = require('method-override');
app.use (methodOverride('_method'));

const flash = require('express-flash');
const session = require('express-session');

// authentication

const passport = require('passport');
const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  
);

const users = [];

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ejs

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.json());

dotenv.config();

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(`MongoDB connected at ${process.env.MONGO_URL}`);
}).catch((err) => {
  console.log(err.message);
});

const port = process.env.PORT || 5000;

// Routes
app.use(express.json());
app.use("/api/booking", require("./routes/api/booking"));
app.use('/', require("./routes/indexRoutes"));
app.use('/', require("./routes/authRoutes"));
app.use('/', require("./routes/emailRoutes"));


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`Webserver app listening on port ${port}`);
});

