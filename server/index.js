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

  socket.on('home-code-changed', ({data, roomId}) => {
    const myRooms = getAllClients(roomId);
    socket.to(roomId).emit('home-code', data);
  })

  socket.on('disconnecting', () => {
    const myRooms = [...socket.rooms];
    myRooms.forEach((roomId) => {
      socket.in(roomId).emit('disconnected', {
        socketId : socket.id,
        username : userSocketMap[socket.id]
      })
    })

    delete userSocketMap[socket.id]
    socket.leave();
  })
});

httpServer.listen(PORT);
