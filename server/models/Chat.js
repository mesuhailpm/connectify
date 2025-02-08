const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  dndUsers: [{ require: true,  type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]

}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
