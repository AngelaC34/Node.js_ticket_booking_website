const express = require('express'); // express framework
const expressLayouts = require('express-ejs-layouts'); // ejs layout templating language
const bodyParser = require('body-parser'); // parse incoming req body for data sent in http req
const mongoose = require('mongoose'); // odm for nodejs mongodb, schema
const path = require('path'); // for manipulating file path cross platform
const methodOverride = require('method-override'); // override HTTP req to support Put and DELETE req
const flash = require('express-flash'); // display flash messages to provide feedback for user after action
const session = require('express-session'); // managing user sessions on server side
const passport = require('passport'); // authentication middleware


// Initialize express app
const app = express();


// Middlewares
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(expressLayouts);
app.use(express.static("public"));
app.use (methodOverride('_method'));


// Connect MongoDB
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(`MongoDB connected at ${process.env.MONGO_URL}`);
}).catch((err) => {
  console.log(err.message);
});


// Passport config
const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  
);


// Routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/booking", require("./routes/api/booking"));
app.use('/', require("./routes/indexRoutes"));
app.use('/authRoutes', require("./routes/authRoutes"));
app.use('/', require("./routes/emailRoutes"));


const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
    console.log(`Webserver app listening on port ${port}`);
});