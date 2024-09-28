const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
