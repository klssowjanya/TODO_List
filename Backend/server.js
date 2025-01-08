const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var serviceAccount = require('./firebase-gen-key(API).json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
// Middleware to parse JSON requests
app.use(express.json());

const cors = require("cors");
app.use(cors());


//create a new ToDo
app.post("/ToDo", (req,res) => {
    const {title,description} = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required" });
    }
    const newTodo = {title,description,createdAt: new Date()};
    db.collection("ToDo")
    .add(newTodo)
    .then((docRef) => {
        res.status(201).json({id : docRef.id, ...newTodo});
    })
    .catch(error =>{
        res.status(500).json({error : "Error adding student", details:error.message});
    });
});

// Get all ToDos (GET)
app.get("/ToDo", async (req, res) => {
    try {
        const snapshot = await db.collection("ToDo").get();
        if (snapshot.empty) {
            return res.status(404).json({ error: "No tasks found" });
        }

        const todos = [];
        snapshot.forEach((doc) => {
            todos.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Error fetching tasks", details: error.message });
    }
});

// Update a ToDo by ID (PUT)
app.put("/ToDo/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title && !description) {
        return res.status(400).json({ error: "At least one of title or description must be provided" });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;

    try {
        const taskRef = db.collection("ToDo").doc(id);
        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Task not found" });
        }

        await taskRef.update(updatedFields);
        res.status(200).json({ id, ...updatedFields });
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Error updating task", details: error.message });
    }
});

// Delete a ToDo by ID (DELETE)
app.delete("/ToDo/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const taskRef = db.collection("ToDo").doc(id);
        const doc = await taskRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Task not found" });
        }

        await taskRef.delete();
        res.status(200).json({ message: "Task deleted successfully", id });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Error deleting task", details: error.message });
    }
});
// Signup
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const userRef = db.collection("Users").doc(email);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userRef.set({
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const userRef = db.collection("Users").doc(email);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const userData = userSnapshot.data();
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
