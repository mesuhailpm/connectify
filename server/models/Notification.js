const mongoose = require('mongoose');

const MmessageNotificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires:'30d'
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

const MmessageNotification = mongoose.model('MmessageNotification', MmessageNotificationSchema);

module.exports = MmessageNotification;