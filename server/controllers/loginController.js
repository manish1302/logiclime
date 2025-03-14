const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async (req, res) => {
  const { firstName, secondName, email, password, role } = req.body;

  try {
    const alreadyExists = await UserModel.find({ email: email });

    if (alreadyExists?.length > 0) {
      return res.status(400).json({ error: "User already exists" });
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
      return res.status(401).json({ error: "User doesn't exist. Check you email." });
    }

    const passwordMatch = await bcrypt.compare(password, userExists?.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Wrong Password" });
      return;
    }

    const token = jwt.sign(
      { userId: userExists?._id, email: userExists?.email, role : userExists?.role },
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

    res
      .status(200)
      .json({
        token: token,
        userId: userExists?._id,
        emaild: userExists?.email,
        userRole : userExists?.role,
        message: "login successful",
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("logiclimetoken", {
      httpOnly: true, 
      secure: true, 
      sameSite: "None",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error during logout" });
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
};

const getUserById = async (req, res) => {
  const Id = req.user.userId;
  try {
    const data = await UserModel.findOne({_id : Id});
    res.status(200).json({
      name : data?.firstName + data?.secondName,
      email : data?.email,
      role : data?.role
    });
  } catch (error) {
    res.status(500).json(error || 'internal server error');
  }
}

module.exports = {
  createUser,
  getAllUsers,
  createDummyUser,
  login,
  getUserById,
  logout
};
