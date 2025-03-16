// server/APIs/adminApi.js
const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel'); 
const Article = require('../models/articleModel'); 
const UserAuthor = require('../models/userAuthorModel'); 
const bcrypt = require('bcrypt');
const expressasynchandler=require("express-async-handler")

// to create admin user initial (should run only once)
router.post('/create-admin', async (req, res) => {
    try {
        
        const existingAdmin = await Admin.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin user already exists.' });
        }

        // Environment variables nunchi admin email password ni get cheyadam
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return res.status(500).json({ message: 'ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables.' });
        }

        const newAdmin = new Admin({
            email: adminEmail,
            password: adminPassword
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin user created successfully.' });

    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Failed to create admin.', error: error.message });
    }
});
router.post('/login', expressasynchandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    console.log("Admin object found:", admin); // Add this line
    if (admin && admin.password === password) {
        res.send({ message: 'success', payload: admin });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
}));
//to read Articles 
router.get('/articles', async (req, res) => {
    // Authentication check 
    try {
        const allArticles = await Article.find({});
        res.status(200).json(allArticles);
    } catch (error) {
        console.error('Error fetching all articles:', error);
        res.status(500).json({ message: 'Failed to fetch articles.', error: error.message });
    }
});

router.get('/users-authors', async (req, res) => {
    // Authentication check
    try {
        const usersAuthors = await UserAuthor.find();
        res.send({ message: 'success', payload: usersAuthors });
    } catch (error) {
        console.error('Error fetching users/authors:', error);
        res.status(500).send({ message: 'Failed to fetch users/authors', error: error.message });
    }
});

router.put('/users-authors/toggle', async (req, res) => {
    const { emails, isActive } = req.body;

    try {
        const updatedUsers = await UserAuthor.updateMany(
            { email: { $in: emails } },
            { $set: { isActive: isActive } }
        );

        if (updatedUsers.modifiedCount > 0) {
            return res.send({ message: 'success' });
        } else {
            return res.status(400).send({ message: 'No users updated.' });
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).send({ message: 'Failed to toggle user status', error: error.message });
    }
});

module.exports = router;