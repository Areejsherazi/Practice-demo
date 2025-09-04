const bcrypt = require("bcrypt");
const userModel = require("../models/SIngUpModel");

const signUpController = async (req, res) => {
  try {
    const { name, email, password, image, phoneNumber, address, role } =
      req.body;

    // Check if user with the same email already exists
    const existingUser = await userModel.findOne({ email });

    // Check if user already exists
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      image,
      phoneNumber,
      address,
      role,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (err) {
    res.status(401).json({ error: err.message, success: false });
  }
};

module.exports = { signUpController };
