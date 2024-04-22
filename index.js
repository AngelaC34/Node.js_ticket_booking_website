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

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(`MongoDB connected at ${process.env.MONGO_URL}`);
}).catch((err) => {
  console.log(err.message);
});

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/booking", require("./routes/api/booking"));

app.use('/', require('../Back-End/routes/api/main'));


// TEST
// app.get('/',checkAuthenticated, (req, res) => {
//   res.render('index', { nama: req.user.name });
// });

//login
// app.get('/login', checkNotAuthenticated, (req, res) => {
//   res.render('login.ejs')
// })

// //signup
// app.get('/signup', checkNotAuthenticated,(req, res) => {
//   res.render('signup');
// });

//post login
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

//post signup
app.post('/signup', async (req, res) => {
 try   {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const users = new User({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
  });
  await users.save()
  res.redirect('/login');
 }    catch(err)    {
  console.log(err)
  res.redirect('/signup');
 }
 console.log(users);
});

app.delete('/logout', (req, res, next) => {
  req.logOut(function
  (err) {
      if (err) {
          return next(err);
      }
      res.redirect('/login');
  });
});
// test end


app.listen(port, () => {
    console.log(`Webserver app listening on port ${port}`);
});

