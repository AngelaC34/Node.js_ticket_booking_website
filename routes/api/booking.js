const {Router} = require('express');
const router = Router();
const Booking = require('../../models/Booking');

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


router.post('/', async (req, res) => {
    const formData = req.body; // Access the form data sent from AngularJS
    console.log('Form Data:', formData); // Log the form data to check if it's received correctly

    const booking = new Booking({
        name: formData.name,
        attractionName: formData.attractionName,
        ticket: formData.ticket,
        date: formData.date,
        phone: formData.phone,
        email: formData.email,
        bookingID: formData.bookingID,
    });
    try
    {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    }
    catch (err)
    {
        console.error('Error saving booking:', err);
        res.status(400).json({message: err.message});
    }

});

//put
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


//delete
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

