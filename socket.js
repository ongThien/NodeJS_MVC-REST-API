let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        //or with an array of origins
        // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
        credentials: true
      }
    });
    return io;
  },
  getIO: () => {
    //if initial io is not defined, throw error
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};