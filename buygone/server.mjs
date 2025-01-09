import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from './src/models/userModel.mjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import cors from 'cors';
import Listing from './src/models/listingModel.mjs';

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:49887', // Allow frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Enable cookies if required
}));

app.use(express.json());

// -------------------- MONGO DB CONNECTION --------------------

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// -------------------- CATEGORY SCHEMA --------------------

const categorySchema = new mongoose.Schema({
    name: String,
    icon: String,
});

const Category = mongoose.model('Category', categorySchema);

// -------------------- LOCATION SCHEMA --------------------

const locationSchema = new mongoose.Schema({
    name: String,
    region: String
});

const Location = mongoose.model('Location', locationSchema, 'Locations');

// -------------------- CATEGORY API --------------------

app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// -------------------- PROFILE API --------------------

const authenticateToken = async (req, res, next) => {
    let token;

    // Check if the request has an authorization header with a Bearer token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extract the token

            // Verify the token

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user object to the request

            req.user = await User.findById(decoded.id).select('-password');
            next(); // Continue to the next middleware
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token
        const user = await User.findById(userId); // Fetch user data from DB

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// -------------------- LOCATION API --------------------

app.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find(); // Fetch all locations
        res.json(locations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

// -------------------- LISTINGS API --------------------

app.get('/listings', async (req, res) => {
    try {
        // Fetch all listings from MongoDB

        const listings = await Listing.find();
        res.status(200).json(listings); // Return listings as JSON
    } catch (err) {
        console.error('Error fetching listings:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/listings/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (err) {
        console.error('Error fetching listing:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// -------------------- GENERATE JWT TOKEN --------------------

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// -------------------- JWT MIDDLEWARE --------------------

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Not authorized, token failed:', error);
            res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// -------------------- ROOT ROUTE --------------------

app.get('/', (req, res) => {
    res.send('API is running...');
});

// -------------------- TEST ROUTE --------------------

app.get('/test-user', async (req, res) => {
    try {
        const user = new User({
            email: 'test@example.com',
            password: 'password123',
        });
        await user.save();
        res.send('User Created!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// -------------------- SIGN-UP ROUTE --------------------

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, password });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully!',
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------- LOG-IN ROUTE --------------------

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({
            message: 'Login successful!',
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------- PROTECTED ROUTE --------------------

app.get('/profile', protect, (req, res) => {
    res.json({
        message: 'Welcome to your profile!',
        user: req.user,
    });
});

// -------------------- LOGOUT ROUTE --------------------

app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully!' });
});

// -------------------- CREATE LISTING ROUTE --------------------

app.post('/listings', async (req, res) => {
    try {
        const { title, category, subcategory, dynamicFields, description, price, email, number, location, images } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newListing = new Listing({
            title,
            category,
            subcategory,
            dynamicFields,
            description,
            price,
            email,
            number,
            location,
            images,
        });

        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        console.error('Error creating listing:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// -------------------- REQUEST PASSWORD RESET --------------------

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const message = {
            to: email,
            subject: 'Password Reset Request',
            text: `You have requested to reset your password. Please use the link below:\n\n ${resetUrl}`,
        };

        await transporter.sendMail(message);

        res.json({ message: 'Password reset email sent!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// -------------------- START SERVER --------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
