const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Datastore = require('@seald-io/nedb'); // NeDB package

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. DATABASE SETUP
// Users list-kaga ungaloda pazhaya permanent DB
const db = new Datastore({ filename: './users.db', autoload: true });
// Movies stream links card-kaga pudhu permanent DB
const moviesDb = new Datastore({ filename: './movies.db', autoload: true });

console.log("NeDB Databases (Users & Movies) Ready, Somu Bro!");

// ---- USER AUTH APIs ----

// SIGNUP API
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await db.findOneAsync({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }
        await db.insertAsync({ email, password });
        res.status(201).json({ message: "Signup Successful & Saved to Permanent DB!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error during signup" });
    }
});

// LOGIN API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.findOneAsync({ email, password });
        if (user) {
            res.status(200).json({ message: "Login Successful", redirect: "home.html" });
        } else {
            res.status(401).json({ message: "Invalid Email or Password! Signup first." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error during login" });
    }
});

// ADMIN VIEW - USER RECORDS FETCH API
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await db.findAsync({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users from NeDB" });
    }
});


// ---- NEW MOVIES ENGINE APIs ----

// A. HOME PAGE-KU LIVE MOVIES FETCH PANRA API
app.get('/api/movies', async (req, res) => {
    try {
        // Puthusa add panra cards mudhalla varra madhiri sort panrom (_id default timestamp base)
        const movies = await moviesDb.findAsync({});
        // NeDB reverse return panna sort support use panla-na, js manual reverse panrom top lists-ku
        res.status(200).json(movies.reverse());
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stream cards" });
    }
});

// B. ADMIN PANEL-LA IRUNDHU MOVIE ADD PANRA API
app.post('/api/admin/add-movie', async (req, res) => {
    const { title, desc, image, url } = req.body;
    try {
        if (!title || !desc || !image || !url) {
            return res.status(400).json({ message: "Ellam input fields-um fill panna venum bro!" });
        }
        
        const newMovie = { title, desc, image, url, createdAt: new Date() };
        await moviesDb.insertAsync(newMovie);
        
        res.status(201).json({ message: "Movie Stream Live-ah Publish Aiyidichu! 🚀" });
    } catch (error) {
        res.status(500).json({ message: "Database insert error code failed" });
    }
});

// PORT SERVER INJECTION
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Somu Stream Server live at http://localhost:${PORT}`);
});
