const express = require('express')
const app = express();
require('./db');
require('dotenv').config();

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/UserRoute');
const candidateRoutes = require('./routes/CandidateRoute');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})