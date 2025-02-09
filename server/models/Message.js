const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  content: { type: String, required: true },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // Users who read the message
  status: {
    type: String,
    enum: ['sent','blocked', 'delivered', 'read'],
    default: 'sent',
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
