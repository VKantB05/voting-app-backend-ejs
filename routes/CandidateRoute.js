const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware, generateToken } = require("../jwt");

const checkAdminRole = async(userId) => {
  try{
    const user = await User.findById(userId);
    return  user.role === 'admin';
  }catch(err){
    return false;
  }
}

//post route to add a candidate 
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const data = req.body;
    const newCandidate = new Candidate(data);

    // save the new candidate to the database
    const response = await newCandidate.save();
    console.log('Candidate added successfully:', response);
    res.status(201).json({ response: response });
  } catch (err) {
    console.error("Error adding candidate:", err.message || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//put route to update a candidate by id
router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const candidateID = req.params.candidateID;
    const updateData = req.body;
    const response = await Candidate.findByIdAndUpdate(candidateID, updateData, { new: true, runValidators: true });

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate updated successfully:", response);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error updating candidate:", err.message || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete route to delete a candidate by id
router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const candidateID = req.params.candidateID;
    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted successfully:", response);
    res.status(200).json(response);
  } catch (err) {
    console.error("Error deleting candidate:", err.message || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// vote count 
router.get('/vote/count', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: 'desc' });

    const voteRecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount
      };
    });

    return res.status(200).json(voteRecord);
  } catch (err) {
    console.error("Error fetching vote count:", err.message || err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get List of all candidates with only name and party fields
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find({}, 'name party -_id');
    res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err.message || err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// let's start voting
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
   candidateID = req.params.candidateID;
   userID = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin is not allowed' });
    }
    if (user.isVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    candidate.votes.push({ user: userID });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    return res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (err) {
    console.error("Error recording vote:", err.message || err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});





module.exports = router;
