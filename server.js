const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Datastore = require('@seald-io/nedb');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use(express.static('.'));

const db = new Datastore({ filename: './users.db', autoload: true });
console.log("NeDB Permanent Database Ready!");

// SIGNUP API
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await db.findOneAsync({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }
        await db.insertAsync({ email, password });
        res.status(201).json({ message: "Signup Successful!" });
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
            res.status(401).json({ message: "Invalid Email or Password!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error during login" });
    }
});

// ADMIN API
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await db.findAsync({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
