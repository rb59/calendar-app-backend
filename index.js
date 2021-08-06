const express = require('express');
require('dotenv').config();
const {dbConnection} = require('./database/config');
const cors = require('cors'); 

// Create express app
const app = express();

// Connect to database
dbConnection();

// CORS
app.use(cors());

// Public folder
app.use(express.static('public'));

// Parse requests to json
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
