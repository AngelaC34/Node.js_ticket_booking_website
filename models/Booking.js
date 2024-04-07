const { Int32 } = require('bson');
const {Schema, model} = require('mongoose');
const { long, double } = require('webidl-conversions');

const BookingSchema = new Schema({
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
    }
});

module.exports = model('Booking', BookingSchema)