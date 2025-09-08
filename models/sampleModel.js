const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
    match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [5, "Email must be at least 5 characters long"],
    maxlength: [100, "Email cannot exceed 100 characters"],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
    minlength: [10, "Phone number must be at least 10 digits"],
    maxlength: [15, "Phone number cannot exceed 15 digits"],
    match: [/^[+0-9][0-9]{9,14}$/, "Please enter a valid phone number"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
    minlength: [2, "City name must be at least 2 characters long"],
    maxlength: [50, "City name cannot exceed 50 characters"]
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
    minlength: [5, "Address must be at least 5 characters long"],
    maxlength: [200, "Address cannot exceed 200 characters"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    maxlength: [100, "Password cannot exceed 100 characters"]
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  profileImage: {
    type: String,
    default: null,
    maxlength: [500, "Profile image URL cannot exceed 500 characters"]
  }
}, {
  timestamps: true
});


userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.confirmPassword;
  delete user.password;
  return user;
};


const User = mongoose.model("User", userSchema);

module.exports = User;