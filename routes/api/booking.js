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
    const booking = new Booking({
        title: req.body.title,
       
    });
    try
    {
        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    }
    catch (err)
    {
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

