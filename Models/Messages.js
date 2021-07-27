const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    toUser: {
        type: Number,
        required: true
    },
    fromUser: {
        type: Number,
        required: true
    },
    messageText: {
        type: String,
        required: true
    },
    messageTime: {
        type: Date,
        required: true
    }
},{timestamps: true});

const Message = mongoose.model('Message',messageSchema);

module.exports = Message;