const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Define a schema for the Person model
const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
votes: {
  type: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  default: []    // ✅ add this line
},
  voteCount: {
    type: Number,
    default: 0,
  },
});

// Create a model for the Person schema
const Candidate = mongoose.model("Candidate", CandidateSchema);
module.exports = Candidate;
