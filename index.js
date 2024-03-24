const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors(
    // {
    //     origin: 'http://localhost:5173',
    //     credentials: true,
    //     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],

    // },
    {
        origin: 'https://health-hub-portal.web.app',
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    }
));
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db('assignment-6');
        const collection = db.collection('users');

        // User Registration
        app.post('/api/v1/register', async (req, res) => {
            const { name, email, password } = req.body;
            console.log(req.body);

            // Check if email already exists
            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            await collection.insertOne({ name, email, password: hashedPassword });

            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });
        });

        // User Login
        app.post('/api/v1/login', async (req, res) => {
            const { email, password } = req.body;
            console.log(req.body);

            // Find user by email
            const user = await collection.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

            res.json({
                success: true,
                message: 'Login successful',
                token
            });
        });


        // ==============================================================
        // WRITE YOUR CODE HERE
        // ==============================================================

        // supply posts
        app.get('/api/v1/supplies', async (req, res) => {
            const supplies = await db.collection('supplies').find().toArray();
            res.json(supplies);
        });

        // get top 6 supplies
        app.get('/api/v1/top-supplies', async (req, res) => {
            const supplies = await db.collection('supplies')
                .find()
                .sort({ amount: -1 }) // Sort by amount in descending order
                .limit(6) // Limit the result to 6 documents
                .toArray();

            res.json(supplies);
        });
        // update supply by id
        app.put('/api/v1/update-supply/:id', async (req, res) => {
            const { id } = req.params;
            const { title, category, amount } = req.body;

            try {
                const result = await db.collection('supplies').updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { title, category, amount } } // Update the fields you want to change
                );

                res.json(result);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });




        // delete supply by _id
        app.delete('/api/v1/supplies/:id', async (req, res) => {
            const { id } = req.params;
            const result = await db.collection('supplies').deleteOne({ _id: new ObjectId(id) });
            res.json(result);
        });
        // create new supply
        app.post('/api/v1/supplies', async (req, res) => {
            const supply = req.body;
            const result = await db.collection('supplies').insertOne(supply);
            res.json(result);

        });
        // get top donor testimonial data
        app.get('/api/v1/top-provider-testimonials', async (req, res) => {
            const topProviderTestimonials = await db.collection('topProviders').find().toArray();
            res.json(topProviderTestimonials);
        }
        );
        //create testimonial
        app.post('/api/v1/testimonials', async (req, res) => {
            const testimonial = req.body;
            const result = await db.collection('testimonials').insertOne(testimonial);
            res.json(result);
        });
        // get all donors data
        app.get('/api/v1/donors', async (req, res) => {
            const donors = await db.collection('donors').find().toArray();
            res.json(donors);
        });
        // get all volunteering posts
        app.get('/api/v1/volunteering-posts', async (req, res) => {
            const volunteeringPosts = await db.collection('volunteeringPosts').find().toArray();
            res.json(volunteeringPosts);
        });
        // get all volunteers
        app.get('/api/v1/volunteers', async (req, res) => {
            const volunteers = await db.collection('volunteers').find().toArray();
            res.json(volunteers);
        });
        // add new volunteers
        app.post('/api/v1/volunteers', async (req, res) => {
            const volunteer = req.body;
            const result = await db.collection('volunteers').insertOne(volunteer);
            res.json(result);
        });

        // get all community posts
        app.get('/api/v1/posts', async (req, res) => {
            const communityPosts = await db.collection('communityPosts').find().toArray();
            res.json(communityPosts);
        });
        // add a post 
        app.post('/api/v1/posts', async (req, res) => {
            const post = req.body;
            const result = await db.collection('communityPosts').insertOne(post);
            res.json(result);
        });
        // add comment to a post 
        app.post('/api/v1/posts/:id/comments', async (req, res) => {
            const { id } = req.params;
            const comment = req.body;

            const result = await db.collection('communityPosts').updateOne(
                { _id: new ObjectId(id) },
                { $push: { comments: comment } }
            );

            res.json(result);
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});