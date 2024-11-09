const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRouter = require('./routes/userRoutes');
const connectDB = require('./config/db');
const userModel = require('./models/userModel');

connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', userRouter);

const PORT = process.env.PORT || 5050;


app.listen(PORT);