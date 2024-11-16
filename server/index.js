const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const classroomRoutes = require('./routes/ClassroomRoutes');
const connectDB = require("./config/db");
const userModel = require("./models/userModel");

connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    credentials: true, // Allow credentials (cookies) to be sent
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", userRouter);
app.use("/api", classroomRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT);
