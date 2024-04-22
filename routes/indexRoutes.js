const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

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

// router.get('/', async (req, res) => {
//     var locals = {
//         title: 'Gardens by the Bay',
//         description: 'Page Description',
//         header: 'Page Header',
//         layout: 'mainlayout.ejs',
//         name: req.user ? req.user.name : 'Guest' // Check if req.user exists
//     };

//     try {
//         const data = await Post.find();
//         res.render('index', locals, data);
//     }
//     catch (error) {
//         console.log(error);
//     }
// });

router.get('/', async (req, res) => {
    try {
        const data = await Post.find();
        const locals = {
            title: 'Gardens by the Bay',
            description: 'Page Description',
            header: 'Page Header',
            layout: 'mainlayout.ejs',
            name: req.user ? req.user.name : 'Guest', // Check if req.user exists
            posts: data // Pass the fetched data to the view
        };
        res.render('index', locals);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


//testing
// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "Building a blog",
//             body: "This is the body text"
//         },
//         {
//             title: "Building a blog",
//             body: "This is the body text"
//         },
//         {
//             title: "Building a blog",
//             body: "This is the body text"
//         },
//     ])
// };

// insertPostData();

router.get('/login', checkNotAuthenticated, function(req, res) {
var locals = {
    title: 'Log In',
    description: 'Page Description',
    header: 'Page Header',
    layout:'mainlayout.ejs'
    };
res.render('login.ejs', locals);
});

router.get('/signup', checkNotAuthenticated, function(req, res) {
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
    res.render('adminDashboard.ejs', locals);
});

router.get('/useracc', function(req, res) {
    var locals = {
        title: 'User Account',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs'
    };
    res.render('useracc.ejs', locals);
});

router.get('/newsletter', function(req, res) {
    var locals = {
        title: 'Newsletter',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs'
    };
    res.render('newsletter.ejs', locals);
});

module.exports = router;