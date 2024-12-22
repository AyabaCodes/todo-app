const express = require("express");
const { signup, login } = require("../controllers/auth.controller");
const router = express.Router();

// Render the registration form
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Render the login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle registration form submission
router.post("/signup", signup);

// Handle login form submission
router.post("/login", login);

module.exports = router;
