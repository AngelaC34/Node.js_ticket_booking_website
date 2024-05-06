const {Router} = require('express');
const router = Router();
const Booking = require('../../models/Booking');
const Post = require('../../models/Post');
const { post } = require('../indexRoutes');

// Membuat booking ID
function generateBookingID(ticket) {
    // Membuat random number untuk booking
    const randomString = Math.random().toString().substring(2, 8);
    return randomString + Date.now().toString() + ticket;
}


// Function to get attraction name based on its code
function getAttractionName(selectedAttraction) {
    return selectedAttraction;
}


// Function to update availability
async function updateAvailability(attractionName, bookedDate, bookedQuantity) {
    try {
        console.log('Attraction Name:', attractionName);
        const availability = await Post.findOne({ title: attractionName });

        if (!availability) {
            return { message: 'Attraction not found.' };
        }

        const existingDate = availability.availableTickets.find(ticket => ticket.date.toString() === new Date(bookedDate).toString());

        if (existingDate) {
            const availableAfterBooking = existingDate.quantity - bookedQuantity;
            if (availableAfterBooking < 0) {
                return { message: 'Tickets not available.' };
            }

            existingDate.quantity -= bookedQuantity;
        } else {
            const newQuantity = availability.ticketQuantity - bookedQuantity;
            availability.availableTickets.push({ date: new Date(bookedDate), quantity: newQuantity });
        }
        await availability.save();
        return { message: 'Availability updated successfully.' };
    } catch (err) {
        throw new Error('Error updating availability: ' + err.message);
    }
}

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

//buy price
async function calculateTotalPrice(quantity) {
    try {
 
        const post = await Post.findOne(); 
        if (!post) {
            throw new Error("Ticket price not found");
        }

        const pricePerTicket = post.ticketPrice;

        const totalPrice = quantity * pricePerTicket;
        console.log(totalPrice);
        return totalPrice;
    } catch (error) {
        console.error("Error calculating total price:", error);
        throw new Error("Error calculating total price");
    }
};

router.post('/create-booking', async (req, res) => {
    try {
        const attractionName =req.body.attraction;
        const bookedDate = req.body.date;
        const bookedQuantity = req.body.ticket;

        if (!attractionName || !bookedDate || !bookedQuantity) {
            throw new Error('Please fill out all required fields.');
        }

        const availabilityCheck = await updateAvailability(attractionName, bookedDate, bookedQuantity);

        if (availabilityCheck.message === 'Tickets not available.' || availabilityCheck.message === 'Attraction not found.') {
            return res.status(400).json({ message: availabilityCheck.message });
        }

        const totalPrice = await calculateTotalPrice(bookedQuantity); 

        const booking = new Booking({
            userID: req.user.id,
            name: req.user.name,
            attractionName,
            ticket: bookedQuantity,
            date: bookedDate,
            phone: req.body.phone,
            email: req.user.email,
            bookingID: generateBookingID(bookedQuantity),
            status: true
        });

        const newBooking = await booking.save();

        req.flash('success', {
            message: 'Booking created successfully!',
            attractionName: attractionName,
            bookedQuantity: bookedQuantity,
            bookedDate: bookedDate,
            totalPrice: totalPrice // Set totalPrice directly without calling toString()
        });
        return res.redirect('/buytickets?success=true');
    } catch (err) {
        console.error('Error creating booking:', err);
        req.flash('error', err.message || 'Failed to create booking. Please try again.');
        return res.redirect('/buytickets?success=false');
    }
});





// update booking contact details for users
router.put('/update-booking-user/:id', async (req, res) => {
    const bookId = req.params.id;
    const { phone } = req.body;

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(bookId, { phone }, {new: true});
    }
    catch (err) {
    }
    res.redirect('/profile');
});

router.put('/update-booking-admin/:id', async (req, res) => {
    const bookId = req.params.id;
    const { status } = req.body;
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(bookId, { status }, { new: true });
        req.flash('success', 'Booking status updated successfully');
    } catch (err) {
        req.flash('error', 'Failed to update booking status');
    }
    res.redirect('/ticketbooking');
});

router.delete('/delete-booking/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        const deletedBooking = await Booking.findByIdAndDelete(bookId);
        req.flash('success', 'Booking deleted successfully');
    } catch (err) {
        req.flash('error', 'Failed to delete booking');
    }
    res.redirect('/ticketbooking');
});



module.exports = router;

