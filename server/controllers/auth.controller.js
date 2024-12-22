const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// Register a new user
exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("signup", {
        errorMessage: "Username already exists",
        successMessage: null,
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hashSync(password, 10);

    // Create a new user
    await User.create({ username, password: hashedPassword });
    console.log("User Created");

    // Redirect to login page after successful registration
    return res.redirect("/api/auth/login");
  } catch (err) {
    console.error("Error during registration:", err.message); // Log the error for debugging
    return res.render("signup", {
      errorMessage: "Error during registration. Please try again.",
      successMessage: null,
    });
  }
};

// Login a user
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    console.log("Login Request:", { username });

    // Find the user by username
    const user = await User.findOne({ username });
    console.log("User Found:", user);

    if (!user) {
      return res.render("login", {
        errorMessage: "Invalid username or password",
        successMessage: null,
      });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcryptjs.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.render("login", {
        errorMessage: "Invalid username or password",
        successMessage: null,
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Store the token in a cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirect to tasks
    res.redirect("/api/tasks");
    // res.render("tasks");
  } catch (err) {
    console.error("Error during login:", err.message);
    res.render("login", {
      errorMessage: "Error during login. Please try again.",
      successMessage: null,
    });
  }
};
