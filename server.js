require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const authRoute = require("./server/routes/auth.route");
const taskRoute = require("./server/routes/task.route");

const connectDB = require("./server/config/db");

//express app
const app = express();
const PORT = 4000 || process.env.PORT;

connectDB();  

//register view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "client/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Serve static files
app.use(express.static(path.join(__dirname, "client/public")));

//listen for server
app.listen(5000, () => {
  console.log("Server has started!");
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/api/auth/login", (req, res) => {
  res.render("login");
});

app.get("/api/auth/signup", (req, res) => {
  res.render("signup");
});

app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);
