const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async (req, res) => {
  const { firstName, secondName, email, password, role } = req.body;

  try {
    const alreadyExists = await UserModel.find({ email: email });

    if (alreadyExists?.length > 0) {
      res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      firstName,
      secondName,
      email,
      password: hashedPassword,
      role,
    });

    const createdUser = await newUser.save();
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, userExists?.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Wrong Password" });
      return;
    }

    console.log(userExists);

    const token = jwt.sign(
      { userId: userExists?._id, email: userExists?.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "100h",
      }
    );


    res.cookie("logiclimetoken", token, {
      httpOnly: false,
      secure: true, // process.env.NODE_ENV === "production", // Only over HTTPS in production
      sameSite: "None", // or "None" for cross-origin
      // maxAge: 100 * 60 * 60 * 1000, // Expiration in milliseconds
    });

    res.status(200).json({ userId : userExists?._id, emaild : userExists?.email, message: "login successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find(); // Await the query to resolve
    res.json(users); // Send the data as a JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" }); // Send an error response
  }
};

const createDummyUser = async () => {
  const newUser = new dummyModel({
    nane: "Batman",
    age: 23,
  });

  await newUser.save();
  console.log("User created:", newUser);
};

module.exports = {
  createUser,
  getAllUsers,
  createDummyUser,
  login,
};
