const express = require('express');
const router = express.Router();
const Testimony = require('../models/Testimony');


// read testimony
router.get('/', async (req, res) => {
    try
    {
        const testimony = await Testimony.find();
        res.status(200).json(testimony);
    }
    catch (err)
    {
        res.status(500).json({message: err.message});
    }
});

// create testimony
router.post('/add-testimony', async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Login to submit testimony.');
        return res.redirect('/login'); // Redirect to login page if not logged in
    }

    const testimony = new Testimony({
        userID: req.user.id,
        name: req.user.name,
        review: req.body.review,
        status: false
    });

    try {
        const newTestimony = await testimony.save();
        req.flash('success', 'Submission success! Your testimony will be reviewed by the admin.');
    } catch (err) {
        console.error('Error saving testimony:', err);
        req.flash('error', 'An error occurred. Please try again later.');
    }

    res.redirect('/home');
});

// update-testimony: admin update to set testimony status
router.put('/update-testimony/:id', async (req, res) => {
    const testiId = req.params.id;
    const { status } = req.body;

    try {
        const updatedTesti = await Testimony.findByIdAndUpdate(testiId, { status }, { new: true });
        console.log(updatedTesti);
        if (!updatedTesti) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.redirect('/testimony');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// delete-testimony
router.delete('/delete-testimony/:id', async (req, res) => {
    const testiId = req.params.id;
    try {
        const deletedTestimony = await Testimony.findByIdAndDelete(testiId);
        if (!deletedTestimony) {
            return console.log({ message: 'Testimony not found' });
        }
    } catch (err) {
        return console.log({ message: err.message });
    }
    res.redirect('/testimony');
});

module.exports = router;