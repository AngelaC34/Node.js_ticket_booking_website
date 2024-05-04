const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Testimony = require('../models/Testimony');


// get testimony
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

// add testimony
router.post('/add-testimony', async (req, res) => {
    const testimony = new Testimony({
        userID: req.user.id,
        name: req.user.name,
        review: req.body.review,
    });
    try {
        const newTestimony = await testimony.save();
    }
    catch (err) {
        console.error('Error saving testimony:', err);
    }
    res.redirect('/home');
});

module.exports = router;