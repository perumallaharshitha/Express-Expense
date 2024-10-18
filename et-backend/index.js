// Import dotenv
require('dotenv').config();

// Import Express Module
const express = require('express');
const app = express();

// CORS
const cors = require('cors');
app.use(cors({
    origin: '*'
    // origin:'http://localhost:8888'
}));

// Import Mongo Client
const { MongoClient } = require('mongodb');

// Database URL
const dbURL = process.env.DB_URL; // Use environment variable

// Create MongoDB Client
const mc = new MongoClient(dbURL);

// Connect to MongoDB
mc.connect().then(connectionObject => {
    
    // Connect to Database
    const companyDatabase = connectionObject.db('etdb');
    
    // Connect to Collection
    const usersCollection = companyDatabase.collection('Users');
    
    // Share the Collection with the APIs
    app.set('usersCollection', usersCollection);
    
    console.log('Connected to MongoDB');
    
    // Assign Port Number to Server
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        
        console.log(`Server running on port http://localhost:${port}`);
    });
}).catch(err => {
    console.log('Error in connecting to MongoDB', err);
});

// Root Endpoint
app.get('/', (req, res) => {
    res.send('This is an API for Expense Tracker Connected to MongoDB');
});

// Import User API
const userAPI = require('./APIs/userAPI');
// If path starts with /user-api, then userAPI will be called
app.use('/user-api', userAPI);

// Handling Invalid Paths
app.use('*', (req, res, next) => {
    res.status(404).send({ message: `Path ${req.originalUrl} is invalid` });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Error Occurred', error: err.message });
});
