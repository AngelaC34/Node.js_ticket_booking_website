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

// Middleware to check if the user is an admin
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
  }
  res.redirect('/'); // Redirect unauthorized users
}



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



app.get('/', function(req, res) {
  var locals = {
      title: 'Gardens by the Bay',
      description: 'Page Description',
      header: 'Page Header',
      layout: 'mainlayout.ejs',
      name: req.user ? req.user.name : 'Guest' // Check if req.user exists
  };
  res.render('index', locals);
});


app.get('/login', checkNotAuthenticated, function(req, res) {
  var locals = {
      title: 'Log In',
      description: 'Page Description',
      header: 'Page Header',
      layout:'mainlayout.ejs'
    };
  res.render('login.ejs', locals);
});

app.get('/signup', checkNotAuthenticated, function(req, res) {
  var locals = {
      title: 'Sign Up',
      description: 'Page Description',
      header: 'Page Header',
      layout:'mainlayout.ejs'
    };
  res.render('signup.ejs', locals);
});

app.get('/about', function(req, res) {
    var locals = {
        title: 'About',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('about.ejs', locals);
});

app.get('/buytickets', function(req, res) {
    var locals = {
        title: 'Buy Tickets',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('buytickets.ejs', locals);
});

app.get('/cloudforest', function(req, res) {
    var locals = {
        title: 'Cloud Forest',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('cloudforest.ejs', locals);
});

app.get('/contact', function(req, res) {
    var locals = {
        title: 'Contact',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('contact.ejs', locals);
});

app.get('/dragonfly', function(req, res) {
    var locals = {
        title: 'Dragonfly',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('dragonfly.ejs', locals);
});

app.get('/floralfantasy', function(req, res) {
    var locals = {
        title: 'Floral Fantasy',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('floralfantasy.ejs', locals);
});

app.get('/flowerdome', function(req, res) {
    var locals = {
        title: 'Flower Dome',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('flowerdome.ejs', locals);
});

app.get('/ourhistory', function(req, res) {
    var locals = {
        title: 'Our History',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('ourhistory.ejs', locals);
});

app.get('/ourstory', function(req, res) {
    var locals = {
        title: 'Our Story',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('ourstory.ejs', locals);
});

app.get('/serenegarden', function(req, res) {
    var locals = {
        title: 'Serene Garden',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('serenegarden.ejs', locals);
});

app.get('/supertreeobservatory', function(req, res) {
    var locals = {
        title: 'Supertree Observatory',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('supertreeobservatory.ejs', locals);
});

app.get('/sustainabilityefforts', function(req, res) {
    var locals = {
        title: 'Sustainability Efforts',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
      };
    res.render('sustainabilityefforts.ejs', locals);
});

app.get('/adminDashboard', function(req, res) {
  var locals = {
      title: 'Admin Dashboard',
      description: 'Page Description',
      header: 'Page Header',
      layout:'adminlayout.ejs'
    };
  res.render('adminDashboard.ejs', locals);
});

app.get('/useracc', function(req, res) {
  var locals = {
      title: 'User Acc',
      description: 'Page Description',
      header: 'Page Header',
      layout:'adminlayout.ejs'
    };
  res.render('useracc.ejs', locals);
});


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

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      return res.redirect('/');
  }
  next();
}

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

