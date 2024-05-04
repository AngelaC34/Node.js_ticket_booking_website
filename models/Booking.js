const {Schema, model} = require('mongoose');

const BookingSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    attractionName: {
        type: String,
        required: true
    },
    ticket: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bookingID: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

module.exports = model('Booking', BookingSchema)