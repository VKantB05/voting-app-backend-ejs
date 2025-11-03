const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { sessionAuthMiddleware } = require('../jwt');

router.get('/signup', (req, res) => res.render('signup', { error: null }));
router.get('/login', (req, res) => res.render('login', { error: null }));

router.get("/profile", sessionAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.redirect('/login');
    res.render('profile', { user: user });
  } catch (err) {
    console.error("Error fetching profile page:", err.message);
    res.redirect('/');
  }
});

// NEW: GET /user/edit -> Renders the page to edit the user's profile
router.get("/edit", sessionAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.redirect('/login');
    // Render the new edit-profile.ejs page, passing the user's data
    res.render('edit-profile', { user: user });
  } catch (err) {
    console.error("Error fetching edit page:", err.message);
    res.redirect('/user/profile');
  }
});



router.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    req.session.user = { id: savedUser.id, name: savedUser.name, role: savedUser.role };
    res.redirect('/user/profile');
  } catch (err) {
    let errorMessage = "An error occurred during registration.";
    if (err.code === 11000) errorMessage = "This Aadhar number is already registered.";
    res.render('signup', { error: errorMessage });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { AadharCard, password } = req.body;
    const user = await User.findOne({ AadharCard });
    if (!user || !(await user.comparePassword(password))) {
       return res.render('login', { error: 'Invalid Aadhar or Password' });
    }
    req.session.user = { id: user.id, name: user.name, role: user.role };
    res.redirect('/user/profile');
  } catch (err) {
    res.render('login', { error: "An internal server error occurred." });
  }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// NEW: POST /user/edit -> Handles the form submission to update user info
router.post("/edit", sessionAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, age } = req.body; // Get only the fields we allow to be updated
        
        await User.findByIdAndUpdate(userId, { name, age });
        
        console.log("User profile updated successfully:", name);
        res.redirect('/user/profile'); // Redirect back to profile to see changes
    } catch (err) {
        console.error("Error updating user profile:", err.message);
        // If there's an error, redirect back to the edit page with a message (optional)
        res.redirect('/user/edit');
    }
});

// NEW: POST /user/delete -> Handles the deletion of the user's account
router.post("/delete", sessionAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            // Should not happen if user is logged in, but good practice
            return res.redirect('/user/profile');
        }

        console.log("User account deleted successfully:", deletedUser.name);
        
        // Destroy the session and log the user out
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/signup'); // Redirect to signup page after deletion
        });

    } catch (err) {
        console.error("Error deleting user account:", err.message);
        res.redirect('/user/profile');
    }
});

// The password change endpoint remains an API for simplicity
router.post("/profile/password", sessionAuthMiddleware, async (req, res) => {
    
});


module.exports = router;