const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//POST route to add a person
router.post("/signup", async (req, res) => {
  console.log("signup req. body :", req.body);
  try {
    const data = req.body; // assuming the request body contains the person data

    // create a new person documnet using the mongoose model
    const newUser = new User(data);

    // save the user to the database
    const response = await newUser.save(); // Yaha await use hua hai kyunki .save() ek asynchronous operation hai.
    console.log("User added successfully:");

    const payload = {
      id: response.id,
    };
    //console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    //console.log('Generated JWT Token:', token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to add person" });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const { AadharCard, password } = req.body;
    const user = await User.findOne({ AadharCard: AadharCard });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    ///generate jwt token
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);

    res.json({ token });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// profile route to get user info
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user; // get the user info from the request object
    const userID = userData.id;
    const user = await User.findById(userID);
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the id from the token
    const { currentPassword, newPassword } = req.body; // Extract current and new password from request body

    const user = await User.findById(userId);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // update the user password
    user.password = newPassword;
    await user.save();
    
    console.log("password updated successfully");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
