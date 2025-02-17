const mongoose = require('mongoose');
const Chat = require('./Chat');
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


messageSchema.post('findOneAndUpdate', async function (doc){
  try {
    await Chat.findOneAndUpdate({_id: doc.chat}, {lastMessage: doc._id}, {new: true} )
    if (doc.target.length === doc.readBy.length) {
      doc.status = 'read'
    }
    await doc.save()
    console.log('chat is updated its last message')
  } catch (error) {
    console.log(error)
  }
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
