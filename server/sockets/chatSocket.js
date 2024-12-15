const { Server } = require("socket.io");
const {updateUserStatus, updateMessageReadStatus, saveMessageToDatabase } = require("../utils/socketHandler.js");
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

    socket.on("user-connected", async (userId) => {
      await updateUserStatus('connect', socket, io, users, userId)
    });

    socket.on("user-logout", async (userId) => {
      await updateUserStatus('disconnect', socket, io,users, userId)
    })

    socket.on("messageSeenByMe", async ({ messageId, chatId, readerId }) => { console.log('first');
    

      await updateMessageReadStatus(io, users,{ messageId, chatId, readerId });
    });

    // Handle incoming messages
    socket.on("sendMessage", async ({ chat, content, userId, _id, target }) => {
      console.log( 'message sent', { chat, content, userId, _id, target })
      await saveMessageToDatabase(io, users, { chat, content, userId, _id, target });
    });

    socket.on("disconnect", async () => {
      console.log('on disconnect, users are', users);

      await updateUserStatus('disconnect', socket,io, users )
    });
  });
};

module.exports = chatSocket;
