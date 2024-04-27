const express = require('express');
const router = express.Router();
const User = require('../models/User');

function checkAuthenticatedAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.admin === true){
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.admin === true) { // Check req.user.admin instead of req.admin
            console.log("admin: " + req.user.admin);
            return res.redirect('/adminDashboard');
        }
        return res.redirect('/');
    }
    next();
}

router.get('/', function(req, res) {
    var locals = {
        title: 'Gardens by the Bay',
        description: 'Page Description',
        header: 'Page Header',
        layout: 'mainlayout.ejs',
        name: req.user ? req.user.name : 'Guest' // Check if req.user exists
    };
    res.render('index', locals);
});

router.get('/login', function(req, res) {
var locals = {
    title: 'Log In',
    description: 'Page Description',
    header: 'Page Header',
    layout:'mainlayout.ejs'
    };
res.render('login.ejs', locals);
});

router.get('/signup', function(req, res) {
var locals = {
    title: 'Sign Up',
    description: 'Page Description',
    header: 'Page Header',
    layout:'mainlayout.ejs'
    };
res.render('signup.ejs', locals);
});

router.get('/about', function(req, res) {
    var locals = {
        title: 'About',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('about.ejs', locals);
});

router.get('/buytickets', function(req, res) {
    var locals = {
        title: 'Buy Tickets',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('buytickets.ejs', locals);
});

router.get('/cloudforest', function(req, res) {
    var locals = {
        title: 'Cloud Forest',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('cloudforest.ejs', locals);
});

router.get('/contact', function(req, res) {
    var locals = {
        title: 'Contact',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('contact.ejs', locals);
});

router.get('/dragonfly', function(req, res) {
    var locals = {
        title: 'Dragonfly',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('dragonfly.ejs', locals);
});

router.get('/floralfantasy', function(req, res) {
    var locals = {
        title: 'Floral Fantasy',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('floralfantasy.ejs', locals);
});

router.get('/flowerdome', function(req, res) {
    var locals = {
        title: 'Flower Dome',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('flowerdome.ejs', locals);
});

router.get('/ourhistory', function(req, res) {
    var locals = {
        title: 'Our History',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('ourhistory.ejs', locals);
});

router.get('/ourstory', function(req, res) {
    var locals = {
        title: 'Our Story',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('ourstory.ejs', locals);
});

router.get('/serenegarden', function(req, res) {
    var locals = {
        title: 'Serene Garden',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('serenegarden.ejs', locals);
});

router.get('/supertreeobservatory', function(req, res) {
    var locals = {
        title: 'Supertree Observatory',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('supertreeobservatory.ejs', locals);
});

router.get('/sustainabilityefforts', function(req, res) {
    var locals = {
        title: 'Sustainability Efforts',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('sustainabilityefforts.ejs', locals);
});

router.get('/adminDashboard', function(req, res) {
    var locals = {
        title: 'Admin Dashboard',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs'
    };
    res.render('admin/adminDashboard.ejs', locals);
});


router.get('/useracc', async function(req, res) {
    const users = await User.find();
    var locals = {
        title: 'User Account',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs',
        users: users
    };
    res.render('admin/useracc.ejs', locals);
});

// edit user
router.get('/:id', async function(req, res) {
    const user = await User.findById(req.params.id);
    var locals = {
        title: 'Edit User',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs',
        user: user
    };
    res.render('admin/edituser.ejs', locals);
});
  

router.get('/newsletter', function(req, res) {
    var locals = {
        title: 'Newsletter',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs'
    };
    res.render('admin/newsletter.ejs', locals);
});

module.exports = router;