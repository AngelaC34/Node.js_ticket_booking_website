const {Router} = require('express');
const router = Router();
const Booking = require('../../models/Booking');

// Function to generate booking ID based on selected attraction and ticket
function generateBookingID(selectedAttraction, ticket) {
    var attractionCode = '';
    switch (selectedAttraction) {
        case 'A':
            attractionCode = 'FD';
            break;
        case 'B':
            attractionCode = 'CF';
            break;
        case 'C':
            attractionCode = 'FF';
            break;
        case 'D':
            attractionCode = 'SO';
            break;
    }
    return attractionCode + Date.now().toString() + ticket;
}

// Function to get attraction name based on its code
function getAttractionName(selectedAttraction) {
    var attractionName = '';
    switch (selectedAttraction) {
        case 'A':
            attractionName = 'Flower Dome';
            break;
        case 'B':
            attractionName = 'Cloud Forest';
            break;
        case 'C':
            attractionName = 'Floral Fantasy';
            break;
        case 'D':
            attractionName = 'Supertree Observatory';
            break;
    }
    return attractionName;
}

// get all booking data for admin
router.get('/', async (req, res) => {
    try
    {
        const booking = await Booking.find();
        res.status(200).json(booking);
    }
    catch (err)
    {
        res.status(500).json({message: err.message});
    }
});

// post new booking for user
router.post('/create-booking', async (req, res) => {
    const booking = new Booking({
        userID: req.user.id,
        name: req.user.name,
        attractionName: getAttractionName(req.body.attraction),
        ticket: req.body.ticket,
        date: req.body.date,
        phone: req.body.phone,
        email: req.user.email,
        bookingID: generateBookingID(req.body.attraction, req.body.ticket),
        status: true
    });
    try
    {
        const newBooking = await booking.save();
        // res.status(201).json(newBooking);
    }
    catch (err)
    {
        console.error('Error saving booking:', err);
        // res.status(400).json({message: err.message});
    }
    res.redirect('/home');
});

// update booking contact details for users
router.put('/update-booking-user/:id', async (req, res) => {
    const bookId = req.params.id;
    const { phone } = req.body;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(bookId, { phone }, {new: true});
        // res.status(200).json(updatedBooking);
    }
    catch (err) {
        // res.status(400).json({message: err.message});
    }
    res.redirect('/profile');
});

// update status for admin
router.put('/update-booking-admin/:id', async (req, res) => {
    const bookId = req.params.id;
    const { status } = req.body;
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(bookId, { status }, {new: true});
        // res.status(200).json(updatedBooking);
    }
    catch (err) {
        // res.status(400).json({message: err.message});
    }
    res.redirect('/ticketbooking');
});


// delete booking by id
router.delete('/delete-booking/:id', async (req, res) => {
    const bookId = req.params.id;
    try
    {
        const deletedBooking = await Booking.findByIdAndDelete(bookId);
        // res.status(200).json("deleted successfully");
    }
    catch (err)
    {
        // res.status(400).json({message: err.message});
    }
    res.redirect('/ticketbooking');
});



module.exports = router;

