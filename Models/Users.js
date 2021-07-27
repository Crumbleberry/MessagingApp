const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: {
        type: Number,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    }
},{timestamps: true});

const User = mongoose.model('messageUser',userSchema);

module.exports = User;