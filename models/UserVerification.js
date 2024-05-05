const {Schema, model} = require('mongoose');

const UserVerificationSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    uniqueString: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
});

module.exports = model('UserVerification', UserVerificationSchema)