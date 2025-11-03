const express = require("express");
const app = express();
require("./db");
require("dotenv").config();
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // req.body

const session = require('express-session'); 
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET, // A secret key for signing the session ID cookie. Store this in your .env file!
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // In production, set this to true if you're using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));



app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));  


const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require("./routes/UserRoute");
const candidateRoutes = require("./routes/CandidateRoute");

//Use the routers
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);

// Render pages
app.get("/", (req, res) => res.render("index",{ user: req.session.user }));
app.get("/signup", (req, res) => res.render("signup"));
app.get("/login", (req, res) => res.render("login"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/candidate", (req, res) => res.render("candidates"));
app.get("/add-candidate", (req, res) => res.render("add-candidate"));
app.get("/vote", (req, res) => res.render("vote"));
app.get("/edit", (req, res) => res.render("edit-profile"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
