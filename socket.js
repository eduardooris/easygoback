const { Server } = require("socket.io");
let IO;

module.exports.initIO = (httpServer) => {
  IO = new Server(httpServer);

  IO.use((socket, next) => {
    if (socket.handshake.query) {
      let callerId = socket.handshake.query.callerId;
      if (callerId) {
        socket.user = callerId;
        return next();
      }
    }
    console.error("Authentication error: No callerId found in query");
    return next(new Error("Authentication error"));
  });

  IO.on("connection", (socket) => {
    console.log(socket.user, "Connected");
    socket.join(socket.user);
    console.log(socket.user, "joined room", socket.user);

    socket.on("call", (data) => {
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;
      console.log("Call event received:", calleeId, rtcMessage);
      console.log("Sending newCall to", calleeId);
      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      let rtcMessage = data.rtcMessage;
      console.log("AnswerCall event received:", callerId, rtcMessage);
      console.log("Sending callAnswered to", callerId);
      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", (data) => {
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;
      console.log("ICEcandidate event received:", calleeId, rtcMessage);
      console.log("Sending ICEcandidate to", calleeId);
      socket.to(calleeId).emit("ICEcandidate", {
        sender: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("disconnect", () => {
      console.log(socket.user, "Disconnected");
    });
  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw new Error("IO not initialized.");
  } else {
    return IO;
  }
};
