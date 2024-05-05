const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//Add Post
router.post('/add-post', async function(req, res) {
    try {
        const { title, body, imageUrl, ticketPrice, ticketQuantity} = req.body;

        // Check if any required parameter is missing
        if (!title || !body || !imageUrl || !ticketPrice || !ticketQuantity) {
            throw new Error("All fields are required.");
        }

        const newPost = new Post({
            title: req.body.title,
            body: req.body.body,
            imageUrl: req.body.imageUrl,
            ticketPrice: req.body.ticketPrice,
            ticketQuantity: req.body.ticketQuantity,
            availableTickets: []
        });

        await Post.create(newPost);
        return res.redirect('/blog?success=true');
    } catch (error) {
        console.error("Error adding blog post:", error);
        res.redirect(`/add-post?error=${encodeURIComponent(error.message)}`);
    }
});

//Edit Put
router.put('/edit-post/:id', async function(req, res) {
    try {
        // Check if any required field is empty
        const { title, body, imageUrl, ticketPrice, ticketQuantity} = req.body;
        if (!title || !body || !imageUrl || !ticketPrice || !ticketQuantity) {
            throw new Error("All fields are required.");
        }

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            imageUrl: req.body.imageUrl,
            ticketPrice: req.body.ticketPrice,
            ticketQuantity: req.body.ticketQuantity,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}?success=true`); // Pass success query parameter if successfully updated
    } catch (error) {
        console.error("Error updating blog post:", error);
        res.redirect(`/edit-post/${req.params.id}?error=${encodeURIComponent(error.message)}`); // Pass error message in query parameter
    }
});

// Route to update attraction (name, ticket price, ticket quantity)
router.post('/update-attraction/:id', async (req, res) => {
    const attractionId = req.params.id;

    try {
        const updatedAttraction = await Post.findByIdAndUpdate(
            attractionId,
            { 
                ticketPrice: req.body.ticketPrice,
                ticketQuantity: req.body.ticketQuantity,
            },
            { new: true }
        );

        if (!updatedAttraction) {
            req.flash('error', 'Attraction not found.');
        } else {
            req.flash('success', 'Attraction updated successfully.');
        }

    } catch (err) {
        console.error('Error updating attraction:', err);
        req.flash('error', 'Internal server error.');
    }

    res.redirect('/editavailability/' + req.params.id);
});

//Delete Post
router.delete('/delete-post/:id', async function(req, res) {
    try {
        await Post.deleteOne( { _id: req.params.id } );
        return res.redirect('/blog?success=true');
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.redirect(`/blog?error=${encodeURIComponent(error.message)}`);
    };
});

// delete ticket availability
router.delete('/delete-availability/:availId/:ticketId', async (req, res) => {
    const availabilityId = req.params.availId;
    const ticketId = req.params.ticketId;

    try {
        const updatedAvailability = await Post.findByIdAndUpdate(
            availabilityId,
            { $pull: { availableTickets: { _id: ticketId } } },
            { new: true }
        );

        if (!updatedAvailability) {
            req.flash('error', 'Availability not found.');
            return res.redirect('/editavailability/' + availabilityId); // Redirect to appropriate page
        }

        req.flash('success', 'Ticket deleted successfully.');
        res.redirect('/editavailability/' + availabilityId); // Redirect to appropriate page
    } catch (err) {
        console.error('Error deleting ticket from availability:', err);
        req.flash('error', 'Internal server error.');
        res.redirect('/editavailability/' + availabilityId); // Redirect to appropriate page
    }
});


module.exports = router;