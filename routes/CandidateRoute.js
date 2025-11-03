// routes/CandidateRoute.js

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Candidate = require("../models/candidate");
const { sessionAuthMiddleware } = require('../jwt');

// Helper functions
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user && user.role === 'admin';
  } catch (err) { return false; }
};



// The main candidate list page
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    let currentUser = null;
    if (req.session.user) {
      currentUser = await User.findById(req.session.user.id);
    }
    res.render('candidate', { candidates: candidates, user: currentUser });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// The results page
router.get('/results', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });
        const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
        res.render('result', { candidates, user: req.session.user, totalVotes });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

// New route to show vote confirmation
router.get('/voted-successfully', sessionAuthMiddleware, async (req, res) => {
    try {
        const candidateId = req.query.candidateId; // Get the ID from the URL query
        if (!candidateId) {
            return res.redirect('/candidate'); // If no ID, just go back
        }

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.redirect('/candidate'); // If candidate not found, go back
        }

        // Render our new 'voted.ejs' page and pass the candidate's info
        res.render('voted', { candidate: candidate });
    } catch (err) {
        console.error("Error showing vote confirmation page:", err);
        res.redirect('/candidate');
    }
});

// Admin-only page routes
router.get('/add', sessionAuthMiddleware, async (req, res) => {
  if (!await checkAdminRole(req.user.id)) return res.status(403).send("Access denied.");
  res.render('add-candidate');
});

router.get('/edit/:id', sessionAuthMiddleware, async (req, res) => {
    if (!await checkAdminRole(req.user.id)) return res.status(403).send("Access denied.");
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).send("Candidate not found.");
    res.render('edit-candidate', { candidate });
});

router.post('/vote/:candidateID', sessionAuthMiddleware, async (req, res) => {
  const { candidateID } = req.params;
  const userId = req.user.id;
  try {
    const candidate = await Candidate.findById(candidateID);
    const user = await User.findById(userId);

    if (!candidate || !user || user.isVoted || user.role === 'admin') {
      return res.redirect('/candidate'); // Security check still redirects here
    }

    // Record the vote
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();
    user.isVoted = true;
    await user.save();
    
    // THE CHANGE: Instead of going back, redirect to our new success page.
    // We pass the candidate's ID in the URL so the page knows who was voted for.
    res.redirect(`/candidate/voted-successfully?candidateId=${candidateID}`);

  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});


// Admin-only action routes
router.post("/", sessionAuthMiddleware, async (req, res) => {
  if (!await checkAdminRole(req.user.id)) return res.status(403).send("Access denied.");
  await new Candidate(req.body).save();
  res.redirect('/candidate');
});

router.post('/edit/:id', sessionAuthMiddleware, async (req, res) => {
    if (!await checkAdminRole(req.user.id)) return res.status(403).send("Access denied.");
    await Candidate.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/candidate');
});

router.post('/delete/:id', sessionAuthMiddleware, async (req, res) => {
    if (!await checkAdminRole(req.user.id)) return res.status(403).send("Access denied.");
    await Candidate.findByIdAndDelete(req.params.id);
    res.redirect('/candidate');
});


module.exports = router;