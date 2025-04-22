const express = require("express");
const app = express();

app.get("/", async (req, res) => {
    res.send("Welcome to Homework API");
});

app.get("/intro", async (req, res) => {
    res.send("i like turtles");
});

app.get("/name", async (req, res) => {
    res.send("Hello, my name is Charlotte");
});

app.get("/hobbies", async (req, res) => {
    // res.send("I enjoy committing mild tax evasion in my spare time");

    const hobbies = ["coding", "reading", "cycling", "tax evasion(mild)"];

    res.send(JSON.stringify(hobbies));
});

app.get("/food", async (req, res) => {
    res.send("My favourite food is milk tea");
});

app.get("/student", async (req, res) => {
    const student = {
        name: "Alex",
        hobbies: ["coding", "reading", "cycling"],
        intro: "Hi, I'm Alex, a Year 2 student passionate about building APIs!",
    };

    res.json(student);
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
