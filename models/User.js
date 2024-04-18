const { Int32 } = require('bson');
const {Schema, model} = require('mongoose');
const { long, double } = require('webidl-conversions');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model('User', UserSchema)