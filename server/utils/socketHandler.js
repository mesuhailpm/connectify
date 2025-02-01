const User = require('../models/User'); // Replace with your actual User model
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

/**
 * @param {'connect' | 'disconnect'} type - The type of event
 * @param {import("socket.io").Server} io - The Socket.IO server instance.
 * @param {typeof Server} io - The Server instance
 * @param {string} [userId] - The user ID
 * @param {{ [key: string]: string }} [users] - A map of user IDs to socket IDs
 * @returns {Promise<void>}
 */

const updateUserStatus = async ( type, socket, io,  users, userId ) => {

  try {
    if (type === "connect") {
      const user = await User.findById(userId)
      if (!user) throw Error(`User not found: ${userId}`);

      // Update online status
      await User.findByIdAndUpdate(userId, { isOnline: true }, { new: true });

      // Add the user to their personal room
      socket.join(userId);

      // Add the user to their contacts' rooms
      const contacts = user.contacts || [];
      contacts.forEach((contact) => {
        socket.join(contact._id.toString());
      });

      // Notify contacts that the user is online
      io.to(userId).emit("user-online", userId);

      // Store the user's socket ID for tracking
      if (users) users[userId] = socket.id;

      console.log(`User ${userId} is now online.`);
    } else if (type === "disconnect") {
      // Leave all rooms
      socket.rooms.forEach((room) => socket.leave(room));

      // Find the user ID based on the socket ID
      const userId = Object.keys(users).find((key) => users[key] === socket.id);
      if (!userId) return;

      // Remove the user from the in-memory users object
      delete users[userId];

      const user = await User.findById(userId);
      if (!user) {
        console.error(`User not found: ${userId}`);
        return;
      }

      // Update the user's online status and last seen
      await User.findByIdAndUpdate(
        userId,
        { isOnline: false, lastSeen: new Date() },
        { new: true }
      );

      // Notify the user's contacts that they are offline
      io.to(userId).emit("user-offline", userId);

      console.log(`User ${userId} is now offline.`);
    }
  } catch (error) {
    console.error(`Error handling '${type}' event:`, error);
  }
};


/**
 * @param {import("socket.io").Server} io - The Socket.IO server instance.
 * @param {{ messageId: string, chatId: string, readerId: string }} params - Parameters containing message ID, chat ID, and reader ID.
 * @param {{ [key: string]: string }} [users] - A map of user IDs to socket IDs
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */

const updateMessageReadStatus = async ( io, users, { messageId, chatId, readerId }) => {

  try {
    console.log("messageseen emitted from receiver");
    await Message.findByIdAndUpdate(
      messageId,
      { $push: { readBy: readerId } },
      { new: true }
    ); // Update the message status to 'read'
    const message = await Message.findById(messageId);

    const sender = message.sender;
    const senderSocketId = users[sender];

    if (senderSocketId) {
      io.to(senderSocketId).emit(
        "messageSeenByTarget",
        messageId,
        readerId,
        chatId
      );
    }
  } catch (error) {
    console.error("Error updating message status to read:", error);
  }

  
}


/**
 * @param {import("socket.io").Server} io - The Socket.IO server instance.
 * @param {{ chat: string, content: string, userId: string, _id: string, target: string }} params - Parameters containing message ID, chat ID, and reader ID.
 * @param {{ [key: string]: string }} [users] - A map of user IDs to socket IDs
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */


const saveMessageToDatabase = async (io, users,{ chat, content, userId, _id, target }) => {

  const newMessage = new Message({
    _id,
    chat,
    sender: userId,
    content,
    status: "sent",
    target,
  });
  try {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    try {
      await newMessage.save({ session: mongooseSession });

      await Chat.findByIdAndUpdate(
        chat,
        { lastMessage: newMessage._id },
        { session: mongooseSession }
      );

      const notification = await Notification.create({
        sender: userId,
        recipient: target,
        content,
        chat,
      });
    
      const senderSocketId = users[userId];
      
      if(senderSocketId){
        io.to(senderSocketId).emit("sendMessageSuccess", newMessage)
      }
      // io.emit("sendMessageSuccess", newMessage);
      const recipientSocketId = users[target];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", newMessage);
      }
      await mongooseSession.commitTransaction();
    } catch (error) {
      await mongooseSession.abortTransaction();
      throw Error("Error saving the message on backend..." + error.message);
    } finally {
      await mongooseSession.endSession();
    }

    // Broadcast to specific chat room or user
  } catch (error) {
    io.emit("sendMessageFailure", newMessage._id);
    console.error("Error sending message:", error);
  }

  
}


module.exports = { updateUserStatus, updateMessageReadStatus, saveMessageToDatabase };
