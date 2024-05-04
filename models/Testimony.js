const {Schema, model} = require('mongoose');

const TestimonySchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

module.exports = model('Testimony', TestimonySchema)