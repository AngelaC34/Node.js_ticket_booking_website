const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Booking = require('../models/Booking');
const Testimony = require('../models/Testimony');

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
        return res.redirect('/home');
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

router.get('/home', async function(req, res) {
    try {
        let perPage = 3;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ {$sort: {updatedAt: -1}}])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const testimonies = await Testimony.find({ status: true }); // Only approved testimonies are displayed

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
            nextPage: hasNextPage ? nextPage : null,
            testimonies: testimonies
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

//Search

// router.post('/search', async function(req, res) {
//     try {
//         let searchTerm = req.body.searchTerm;
//         const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
//         const data = await Post.find({
//             $or: [
//                 {
//                     title: { $regex: new RegExp(searchNoSpecialChar, 'i')}            
//                 },
//                 {
//                     body: { $regex: new RegExp(searchNoSpecialChar, 'i')},    
//                 }
//             ]
//         });

//         const locals = {
//             title: 'Search',
//             description: 'Page Description',
//             layout: 'mainlayout.ejs',
//             data: data
//         };


//         res.render("search",locals); // Redirect to the search page
//     } catch (error) {
//         console.log(error);
//     }
// });

router.post('/search', async function(req, res) {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        let sortBy = req.body.sortBy || 'updatedAt'; // Default sort by updatedAt
        let sortOrder = req.body.sortOrder || -1; // Default sort order descending
        let minPrice = req.body.minPrice; // Minimum price filter
        let maxPrice = req.body.maxPrice; // Maximum price filter

        let filter = {}; // Initialize an empty filter object

        // Construct the filter object based on the provided minPrice and maxPrice
        if (minPrice !== undefined && maxPrice !== undefined) {
            filter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice !== undefined) {
            filter.price = { $gte: minPrice };
        } else if (maxPrice !== undefined) {
            filter.price = { $lte: maxPrice };
        }

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ],
            ...filter // Merge the filter object into the query
        }).sort({ [sortBy]: sortOrder });

        const locals = {
            title: 'Search',
            description: 'Page Description',
            layout: 'mainlayout.ejs',
            data: data
        };

        res.render("search", locals);
    } catch (error) {
        console.log(error);
    }
});

//Test Insert
function insertPostData () {
    Post.insertMany([
        {
            title: "SuperTree Observatory",
            body: "The SuperTree Observatory has many good sights",
            imageUrl: "https://www.gardensbythebay.com.sg/content/dam/gbb-2021/image/things-to-do/attractions/supertree-observatory/custom/supertree-observatory3-1670x940.jpg.renderimage.455.256.jpg",
            price: "75$ SGD"
        }
    ])
}

// insertPostData();

//Test Insert
function insertPostData () {
    Post.insertMany([
        {
            title: "SuperTree Observatory",
            body: "The SuperTree Observatory has many good sights",
            imageUrl: "https://www.gardensbythebay.com.sg/content/dam/gbb-2021/image/things-to-do/attractions/supertree-observatory/custom/supertree-observatory3-1670x940.jpg.renderimage.455.256.jpg",
            price: "75$ SGD"
        }
    ])
}

// insertPostData();

// router.post('/search', async function(req, res) {
//     try {
//         const locals = {
//             title: 'Search',
//             description: 'Page Description',
//             header: 'Page Header',
//             layout: 'mainlayout.ejs',
//             post: post
//         };
//         res.render('search', locals);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// });



// profile
router.get('/profile', checkAuthenticated, async function(req, res) {
    const bookings = await Booking.find({ userID: req.user.id });
    console.log(bookings);
    var locals = {
        title: 'Profile',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs',
        bookings: bookings
    };
    res.render('profile.ejs', locals);
});

// edit booking
router.get('/editbooking/:id', async function(req, res) {
    const booking = await Booking.findById(req.params.id);
    var locals = {
        title: 'Edit User',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs',
        booking: booking
    };
    res.render('editbooking.ejs', locals);
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
router.get('/buytickets', checkAuthenticated, function(req, res) {
    var locals = {
        title: 'Buy Tickets',
        description: 'Page Description',
        header: 'Page Header',
        layout:'mainlayout.ejs'
    };
    res.render('buytickets.ejs', locals);
});

// // cloud forest
// router.get('/cloudforest', function(req, res) {
//     var locals = {
//         title: 'Cloud Forest',
//         description: 'Page Description',
//         header: 'Page Header',
//         layout:'mainlayout.ejs'
//     };
//     res.render('cloudforest.ejs', locals);
// });

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

// // dragonfly
// router.get('/dragonfly', function(req, res) {
//     var locals = {
//         title: 'Dragonfly',
//         description: 'Page Description',
//         header: 'Page Header',
//         layout:'mainlayout.ejs'
//     };
//     res.render('dragonfly.ejs', locals);
// });

// // floral fantasy
// router.get('/floralfantasy', function(req, res) {
//     var locals = {
//         title: 'Floral Fantasy',
//         description: 'Page Description',
//         header: 'Page Header',
//         layout:'mainlayout.ejs'
//     };
//     res.render('floralfantasy.ejs', locals);
// });

// // flower dome
// router.get('/flowerdome', function(req, res) {
//     var locals = {
//         title: 'Flower Dome',
//         description: 'Page Description',
//         header: 'Page Header',
//         layout:'mainlayout.ejs'
//     };
//     res.render('flowerdome.ejs', locals);
// });

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

// // serene garden
// router.get('/serenegarden', function(req, res) {
//     var locals = {
//         title: 'Serene Garden',
//         description: 'Page Description',
//         header: 'Page Header',
//         layout:'mainlayout.ejs'
//     };
//     res.render('serenegarden.ejs', locals);
// });

// // super tree observatory
// router.get('/supertreeobservatory', function(req, res) {
//     var locals = {
//         title: 'Supertree Observatory',
//         description: 'Page Description',
//         header: 'Page Header',
//         layout:'mainlayout.ejs'
//     };
//     res.render('supertreeobservatory.ejs', locals);
// });

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

// ADMIN ROUTES

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
router.get('/useraccount', async function(req, res) {
    const users = await User.find();
    var locals = {
        title: 'User Account',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs',
        users: users
    };
    res.render('admin/useraccount.ejs', locals);
});

// ticket booking
router.get('/ticketbooking', async function(req, res) {
    const bookings = await Booking.find();
    var locals = {
        title: 'Ticket Booking',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs',
        bookings: bookings
    };
    res.render('admin/ticketbooking.ejs', locals);
});


// edit user
router.get('/edituser/:id', async function(req, res) {
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

// testimony
router.get('/testimony', async function(req, res) {
    const testimonies = await Testimony.find();
    var locals = {
        title: 'Testimony',
        description: 'Page Description',
        header: 'Page Header',
        layout:'adminlayout.ejs',
        testimonies: testimonies
    };
    res.render('admin/testimony.ejs', locals);
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

//Admin Posts
router.get('/blog', async function(req, res) {
    try {
        const data = await Post.find();
        var locals = {
            title: 'Blog',
            description: 'Page Description',
            header: 'Page Header',
            layout:'adminlayout.ejs',
            data: data
        };
        res.render('admin/blog.ejs', locals);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
    };
});

router.get('/add-post', async function(req, res) {
    try {
        const data = await Post.find();
        const locals = {
            title: 'Add Blog',
            description: 'Page Description',
            header: 'Page Header',
            layout:'adminlayout.ejs',
            data: data
        };
        res.render('admin/add-post.ejs', locals);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
    };
});

router.post('/add-post', async function(req, res) {
    try {

        try{
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body,
                imageUrl: req.body.imageUrl,
                price: req.body.price
            });
            await Post.create(newPost);
            res.redirect('/blog');
        }
        catch (error){
            console.log(error);
        }

    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
    };
});

router.get('/edit-post/:id', async function(req, res) {
    try {
        const data = await Post.findOne({ _id: req.params.id });
        const locals = {
            title: 'Edit Blog',
            description: 'Page Description',
            header: 'Page Header',
            layout:'adminlayout.ejs',
            data: data
        };
        res.render('admin/edit-post.ejs', locals);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
    };
});

router.put('/edit-post/:id', async function(req, res) {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
    };
});

router.delete('/delete-post/:id', async function(req, res) {
    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect(`/blog`); 
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
    };
});

module.exports = router;