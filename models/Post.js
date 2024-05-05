const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String, 
        required: true,
    },
    ticketPrice: {
        type: String, 
        required: true,
    },
    ticketQuantity: {
        type: Number,
        required: true,
    },
    availableTickets: [{
        date: { type: Date, required: false },
        quantity: { type: Number, required: false, default: 0 },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model('Post', PostSchema);
