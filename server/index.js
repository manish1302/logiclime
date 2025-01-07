const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const classroomRoutes = require("./routes/ClassroomRoutes");
const asssignmentRoutes = require("./routes/AssignmentRoutes");
const studentMarksRoutes = require("./routes/StudenttMarksRoutes");
const connectDB = require("./config/db");
const userModel = require("./models/userModel");

connectDB();

const app = express();
app.use(
  cors({
    origin: "http://127.0.0.1:5173", // Replace with your frontend origin
    credentials: true, // Allow credentials (cookies) to be sent
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", classroomRoutes);
app.use("/api", asssignmentRoutes);
app.use("/api", studentMarksRoutes);

const PORT = process.env.PORT || 5050;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5173",
    credentials: true,
  },
});

const userSocketMap = {};
const userDiscussSocketMap = {};

function getAllClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

function getAllDiscussClients(roomId) {
  return Array.from(io.of("/discuss").adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userDiscussSocketMap[socketId],
      };
    }
  );
}

// const classNamespace = io.of(/^\/classCode:.+$/)
io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const allClients = getAllClients(roomId);
    allClients.forEach(({ socketId }) => {
        io.to(socketId).emit("joined", {
          allClients,
          username,
          socketId: socket.id,
        });
    });
  });

  socket.on("home-code-changed", ({ data, roomId }) => {
    const myRooms = getAllClients(roomId);
    socket.to(roomId).emit("home-code", data);
  });

  socket.on("disconnecting", () => {
    const myRooms = [...socket.rooms];
    myRooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

io.of("/discuss").on("connection", (socket) => {
  socket.on("join-room", ({ roomId, username }) => {
    userDiscussSocketMap[socket.id] = username;
    const allClients = getAllDiscussClients(roomId);
    socket.join(roomId);
    allClients.forEach(({ socketId }) => {
        io.of("/discuss").to(socketId).emit("joined", {
          allClients,
          username,
          socketId: socket.id,
        });
    });
  });

  socket.on("code-changed", ({ data, position, roomId }) => {
    socket.to(roomId).emit("code-changed", {
      data,
      position,
    });
  });

  socket.on("disconnecting", () => {
    const myRooms = [...socket.rooms];
    myRooms.forEach((roomId) => {
      socket.in(roomId).emit("disconnected", {
        socketId: socket.id,
        username: userDiscussSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on("join-call", ({toRoomId, offer}) => { 
    console.log(toRoomId, offer)
    io.of('/discuss').to(toRoomId).emit('incomming-call', {
      from : socket.id,
      offer
    })
  })

  socket.on('call-accepted', ({to, ans}) => {
    console.log(to, ans);
    io.of('/discuss').to(to).emit('call-accepted', {
      from : socket.id,
      ans
    })
  })

  socket.on('peer:nego:needed', ({to, offer}) => {
    io.of('/discuss').to(to).emit('peer:nego:needed', {
      from : socket.id,
      offer
    })
  })

  socket.on('peer:nego:done', ({to, ans}) => {
    io.of('/discuss').to(to).emit('peer:nego:final', {
      from : socket.id,
      ans
    })
  })

});

httpServer.listen(PORT);
