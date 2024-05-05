const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// Route to create new availability
router.post('/create-availability', async (req, res) => {
    const { attractionName, ticketPrice, ticketQuantity } = req.body;

    try {
        // Check if the availability already exists for the attraction
        const existingAvailability = await Availability.findOne({ name: attractionName });
        if (existingAvailability) {
            // If availability already exists, you can handle it here, such as returning an error response
            // return res.status(400).json({ message: 'Availability for this attraction already exists.' });
        }

        // Create a new availability record
        const newAvailability = new Availability({
            name: attractionName,
            ticketPrice,
            ticketQuantity,
            availableTickets: []
        });

        await newAvailability.save();
        // res.status(201).json({ message: 'Availability created successfully.' });
    } catch (err) {
        console.error('Error creating availability:', err);
        // res.status(500).json({ message: 'Internal server error.' });
    }
    res.redirect('/ticketavailability');
});

// Route to update attraction (name, ticket price, ticket quantity)
router.post('/update-attraction/:id', async (req, res) => {
    const attractionId = req.params.id;
    const { name, ticketPrice, ticketQuantity } = req.body;

    try {
        const updatedAttraction = await Availability.findByIdAndUpdate(
            attractionId,
            { name, ticketPrice, ticketQuantity },
            { new: true }
        );

        if (!updatedAttraction) {
            return res.status(404).json({ message: 'Attraction not found.' });
        }

        res.status(200).json({ message: 'Attraction updated successfully.', updatedAttraction });
    } catch (err) {
        console.error('Error updating attraction:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route to update availability
router.post('/update-availability', async (req, res) => {
    const { attractionName, bookedDate, bookedQuantity } = req.body;

    try {
        const result = await updateAvailability(attractionName, bookedDate, bookedQuantity);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

/// Route to delete availability
router.delete('/delete-attraction/:id', async (req, res) => {
    const availabilityId = req.params.id;

    try {
        const deletedAvailability = await Availability.findByIdAndDelete(availabilityId);
        if (!deletedAvailability) {
            return res.status(404).json({ message: 'Availability not found.' });
        }
        res.status(200).json({ message: 'Availability deleted successfully.' });
    } catch (err) {
        console.error('Error deleting availability:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.delete('/delete-availability/:availId/:ticketId', async (req, res) => {
    const availabilityId = req.params.availId;
    const ticketId = req.params.ticketId;

    try {
        const updatedAvailability = await Availability.findByIdAndUpdate(
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


// Function to update availability
async function updateAvailability(attractionName, bookedDate, bookedQuantity) {
    try {
        // Find the availability record by attraction name
        const availability = await Availability.findOne({ name: attractionName });

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

module.exports = router;