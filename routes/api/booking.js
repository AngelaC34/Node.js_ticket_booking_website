const {Router} = require('express');
const router = Router();
const Booking = require('../../models/Booking');
const Post = require('../../models/Post');

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

// Function to update availability
async function updateAvailability(attractionName, bookedDate, bookedQuantity) {
    try {
        // Find the availability record by attraction name
        const availability = await Post.findOne({ name: attractionName });

        if (!availability) {
            // If attraction is not found, return an error message
            return { message: 'Attraction not found.' };
        }

        // Check if the date already exists in the availability record
        const existingDate = availability.availableTickets.find(ticket => ticket.date.toString() === new Date(bookedDate).toString());

        if (existingDate) {
            // Check if tickets are available after booking
            const availableAfterBooking = existingDate.quantity - bookedQuantity;
            if (availableAfterBooking < 0) {
                // If tickets are not available, return an error message
                return { message: 'Tickets not available.' };
            }

            // Update the quantity if the date exists and tickets are available
            existingDate.quantity -= bookedQuantity;
        } else {
            // Calculate the new quantity based on the ticket quantity and booked quantity
            const newQuantity = availability.ticketQuantity - bookedQuantity;
            // Push the new date and quantity to availableTickets
            availability.availableTickets.push({ date: new Date(bookedDate), quantity: newQuantity });
        }

        // Save the updated availability
        await availability.save();
        return { message: 'Availability updated successfully.' };
    } catch (err) {
        throw new Error('Error updating availability: ' + err.message);
    }
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
// router.post('/create-booking', async (req, res) => {
//     const booking = new Booking({
//         userID: req.user.id,
//         name: req.user.name,
//         attractionName: getAttractionName(req.body.attraction),
//         ticket: req.body.ticket,
//         date: req.body.date,
//         phone: req.body.phone,
//         email: req.user.email,
//         bookingID: generateBookingID(req.body.attraction, req.body.ticket),
//         status: true
//     });
//     try
//     {
//         const newBooking = await booking.save();
//         // res.status(201).json(newBooking);
//     }
//     catch (err)
//     {
//         console.error('Error saving booking:', err);
//         // res.status(400).json({message: err.message});
//     }
//     res.redirect('/home');
// });


router.post('/create-booking', async (req, res) => {
    const attractionName = getAttractionName(req.body.attraction);
    const bookedDate = req.body.date;
    const bookedQuantity = req.body.ticket;

    try {
        const availabilityCheck = await updateAvailability(attractionName, bookedDate, bookedQuantity);

        if (availabilityCheck.message === 'Tickets not available.' || availabilityCheck.message === 'Attraction not found.') {
            // Handle case where tickets are not available or attraction is not found
            return res.status(400).json({ message: availabilityCheck.message });
        }

        // Create the booking if availability check passes
        const booking = new Booking({
            userID: req.user.id,
            name: req.user.name,
            attractionName,
            ticket: bookedQuantity,
            date: bookedDate,
            phone: req.body.phone,
            email: req.user.email,
            bookingID: generateBookingID(attractionName, bookedQuantity),
            status: true
        });

        const newBooking = await booking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
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

