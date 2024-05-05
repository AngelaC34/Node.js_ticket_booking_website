const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    ticketPrice: { type: Number, required: true, default: 0 }, // Price for all tickets at the attraction
    ticketQuantity: { type: Number, required: true, default: 0 },
    availableTickets: [{
        date: { type: Date, required: false },
        quantity: { type: Number, required: false, default: 0 }
    }]
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
