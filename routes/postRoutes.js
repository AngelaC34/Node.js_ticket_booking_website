const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// create new post
router.post('/add-post', async function(req, res) {
    try {
        // Check if the availability already exists for the attraction
        const existingPost = await Post.findOne({ title: req.body.attractionName });
        if (existingPost) {
            // If availability already exists, you can handle it here, such as returning an error response
            // return res.status(400).json({ message: 'Availability for this attraction already exists.' });
        }
        try{
            const newPost = new Post({
                title: req.body.attractionName,
                body: req.body.body,
                imageUrl: req.body.imageUrl,
                ticketPrice: req.body.ticketPrice,
                ticketQuantity: req.body.ticketQuantity,
                availableTickets: []
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

// update post details
router.put('/edit-post/:id', async function(req, res) {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            imageUrl: req.body.imageUrl,
            ticketPrice: req.body.ticketPrice,
            ticketQuantity: req.body.ticketQuantity,
            updatedAt: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
    };
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
            // return res.status(404).json({ message: 'Attraction not found.' });
        }

        // res.status(200).json({ message: 'Attraction updated successfully.', updatedAttraction });
    } catch (err) {
        console.error('Error updating attraction:', err);
        // res.status(500).json({ message: 'Internal server error.' });
    }
    res.redirect('/ticketavailability');
});

// delete post
router.delete('/delete-post/:id', async function(req, res) {
    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect(`/blog`); 
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).send("An error occurred while fetching blog posts. Please try again later.");
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
            return res.status(404).json({ message: 'Availability not found.' });
        }

        res.status(200).json({ message: 'Ticket deleted successfully.', updatedAvailability });
    } catch (err) {
        console.error('Error deleting ticket from availability:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;