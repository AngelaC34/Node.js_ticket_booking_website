const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.post('/signup', async (req, res) => {
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
   
router.delete('/logout', (req, res, next) => {
    req.logOut(function
    (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;