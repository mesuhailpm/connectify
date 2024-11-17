const { Server } = require("socket.io");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { default: mongoose } = require("mongoose");

const chatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://connectify-kappa-ten.vercel.app", // Your frontend URL
      methods: ["GET", "POST"],
      credentials: true, // Allow cookies if needed
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle incoming messages
    socket.on("sendMessage", async ({ chatId, messageText, userId, _id }) => {
      const newMessage = new Message({
        chat: chatId,
        sender: userId,
        content: messageText,
        status: "sent",
      });
      try {
        const mongooseSession = await mongoose.startSession();
        mongooseSession.startTransaction();
        try {
          await newMessage.save({ session: mongooseSession });

          await Chat.findByIdAndUpdate(
            chatId,
            { lastMessage: newMessage._id },
            { session: mongooseSession }
          );
          await mongooseSession.commitTransaction();
        } catch (error) {
          await mongooseSession.abortTransaction();
          throw Error("Error saving the message on backend..." + error.message);
        } finally {
          await mongooseSession.endSession();
        }

        // Broadcast to specific chat room or user
        io.emit("sendMessageSuccess", newMessage);
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
