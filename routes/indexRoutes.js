const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// if not admin, redirect to login
function checkAuthenticatedAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.admin === true){
        return next();
    }
    res.redirect('/login');
}

// if not authenticated user, redirect to login (buy ticket page)
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

// if authenticated, redirect to home
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

// home
// router.get('', async function(req, res) {
    
//     try {
//         const locals = {
//             title: 'Gardens by the Bay',
//             description: 'Page Description',
//             header: 'Page Header',
//             layout: 'mainlayout.ejs',
//             name: req.user ? req.user.name : 'Guest', // Check if req.user exists
//         };
//         const data = await Post.find();
//         res.render('index', {locals, data});
//     } catch (error) {
//         console.log(error);
//     }
// });

router.get('', async function(req, res) {
    try {
        let perPage = 3;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ {$sort: {updatedAt: -1}}])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const locals = {
            title: 'Gardens by the Bay',
            description: 'Page Description',
            header: 'Page Header',
            layout: 'mainlayout.ejs',
            name: req.user ? req.user.name : 'Guest', // Check if req.user exists
            data: data,  // Pass the fetched data to the template
            current: page,
            nextPage: hasNextPage ? nextPage : null
        };

        res.render('index', locals);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error'); // Handle error appropriately
    }
});


// router.get('', async function(req, res) {
//     try {
//         let perPage = 3;
//         let page = req.query.page || 1;

//         const data = await Post.aggregate([ {$sort: {updatedAt: -1}}])
//             .skip(perPage * page - perPage)
//             .limit(perPage)
//             .exec();

//         console.log("Fetched Data:", data); // Log fetched data

//         const count = await Post.countDocuments();
//         const nextPage = parseInt(page) + 1;
//         const hasNextPage = nextPage <= Math.ceil(count / perPage);

//         const locals = {
//             title: 'Gardens by the Bay',
//             description: 'Page Description',
//             header: 'Page Header',
//             layout: 'mainlayout.ejs',
//             name: req.user ? req.user.name : 'Guest',
//             data: data,
//             current: page,
//             nextPage: hasNextPage ? nextPage : null
//         };

//         res.render('index', locals);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// Posts

// router.get('/post/:id', async function(req, res) {
//     try {
//         const locals = {
//             title: 'Posts',
//             description: 'Page Description',
//             header: 'Page Header',
//             layout: 'mainlayout.ejs'
//         };
//         let slug = req.params.id;

//         const data = await Post.findById({_id: slug});
//         res.render('post', {locals, data});
//     } catch (error) {
//         console.log(error);
//     }
// });

// router.get('/post/:id', async function(req, res) {
//     try {
//         const locals = {
//             title: 'Posts',
//             description: 'Page Description',
//             header: 'Page Header',
//             layout: 'mainlayout.ejs'
//         };
//         let slug = req.params.id;

//         const post = await Post.findById(slug); // Assuming your post model is called 'Post'
//         res.render('post.ejs', { locals, post }); // Pass the 'post' object to the template
//     } catch (error) {
//         console.log(error);
//     }
// });

router.get('/post/:id', async function(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        const locals = {
            title: 'Posts',
            description: 'Page Description',
            header: 'Page Header',
            layout: 'mainlayout.ejs',
            post: post
        };
        res.render('post', locals);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});



// login page
router.get('/login', function(req, res) {
var locals = {
    title: 'Log In',
    description: 'Page Description',
    header: 'Page Header',
    layout:'mainlayout.ejs'
    };
res.render('login.ejs', locals);
});

// signup page
router.get('/signup', function(req, res) {
var locals = {
    title: 'Sign Up',
    description: 'Page Description',
    header: 'Page Header',
    layout:'mainlayout.ejs'
    };
res.render('signup.ejs', locals);
});

// about
router.get('/about', function(req, res) {
    var locals = {
        title: 'About',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('about.ejs', locals);
});

// buy tickets
router.get('/buytickets', function(req, res) {
    var locals = {
        title: 'Buy Tickets',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('buytickets.ejs', locals);
});

// cloud forest
router.get('/cloudforest', function(req, res) {
    var locals = {
        title: 'Cloud Forest',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('cloudforest.ejs', locals);
});

// contact
router.get('/contact', function(req, res) {
    var locals = {
        title: 'Contact',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('contact.ejs', locals);
});

// dragonfly
router.get('/dragonfly', function(req, res) {
    var locals = {
        title: 'Dragonfly',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('dragonfly.ejs', locals);
});

// floral fantasy
router.get('/floralfantasy', function(req, res) {
    var locals = {
        title: 'Floral Fantasy',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('floralfantasy.ejs', locals);
});

// flower dome
router.get('/flowerdome', function(req, res) {
    var locals = {
        title: 'Flower Dome',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('flowerdome.ejs', locals);
});

// our history
router.get('/ourhistory', function(req, res) {
    var locals = {
        title: 'Our History',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('ourhistory.ejs', locals);
});

// our story
router.get('/ourstory', function(req, res) {
    var locals = {
        title: 'Our Story',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('ourstory.ejs', locals);
});

// serene garden
router.get('/serenegarden', function(req, res) {
    var locals = {
        title: 'Serene Garden',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('serenegarden.ejs', locals);
});

// super tree observatory
router.get('/supertreeobservatory', function(req, res) {
    var locals = {
        title: 'Supertree Observatory',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('supertreeobservatory.ejs', locals);
});

// sustainability efforts
router.get('/sustainabilityefforts', function(req, res) {
    var locals = {
        title: 'Sustainability Efforts',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('sustainabilityefforts.ejs', locals);
});

// admin dashboard
router.get('/adminDashboard', function(req, res) {
    var locals = {
        title: 'Admin Dashboard',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs'
    };
    res.render('admin/adminDashboard.ejs', locals);
});

// user account
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
  
// newsletter
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