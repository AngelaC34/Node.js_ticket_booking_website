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
router.post('/', async (req, res) => {
    const booking = new Booking({
        userID: req.user.id,
        name: req.user.name,
        attractionName: getAttractionName(req.body.attraction),
        ticket: req.body.ticket,
        date: req.body.date,
        phone: req.body.phone,
        email: req.user.email,
        bookingID: generateBookingID(req.body.attraction, req.body.ticket),
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

});

// update booking by id
router.put('/:id', async (req, res) => {
    try
    {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updatedBooking);
    }
    catch (err)
    {
        res.status(400).json({message: err.message});
    }
});


// delete booking by id
router.delete('/:id', async (req, res) => {
    try
    {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json("deleted successfully");
    }
    catch (err)
    {
        res.status(400).json({message: err.message});
    }
});



module.exports = router;

