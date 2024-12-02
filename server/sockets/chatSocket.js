const { Server } = require("socket.io");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { default: mongoose } = require("mongoose");

const users = {}; // In-memory storage for user IDs and their corresponding socket IDs

const chatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register the user's socket ID
    socket.on("registerUser", (userId) => {
      users[userId] = socket.id;
      console.log(users, " are updated");
    });

    socket.on("messageSeenByMe", async ({messageId, chatId, readerId }) => {
      try {
        console.log('messageseen emitted from receiver')
        await Message.findByIdAndUpdate(messageId, { $push:{readBy: readerId}}, {new: true}); // Update the message status to 'read'
        const message = await Message.findById(messageId)
        const sender = message.sender
        const senderSocketId = users[sender]
        console.log(readerId,' is readerId')
        console.log(users,'senderSocketIdare users')
        console.log(senderSocketId, ' is senderSocketId')
        if( senderSocketId) {
          io.to(senderSocketId).emit("messageSeenByTarget", messageId, readerId, chatId);
        }
      } catch (error) {
        console.error('Error updating message status to read:', error);
      }
    })

    // Handle incoming messages
    socket.on("sendMessage", async ({ chat, content, userId, _id, target }) => {
      console.log({ chat, content, userId, _id , target }, ' is inside send Message (socket)');
      const newMessage = new Message({
        _id,
        chat: chat,
        sender: userId,
        content: content,
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
          io.emit("sendMessageSuccess", newMessage);
          const recipientSocketId = users[target];
          if(recipientSocketId) {
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
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = chatSocket;
