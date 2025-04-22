const express = require("express");
const app = express();
const port = 3000;

app.get("", (req, res) => {
    res.send("Hello World!");
});

app.get("/about", async (req, res) => {
    res.send("About page");
});

app.get("/contact", async (req, res) => {
    res.send("Contact page");
});

app.listen(port, () => {
    console.log(`LISTENING TO PORT ${port}`);
    console.log(`LISTENING TO PORT ${port}`);
    console.log(`LISTENING TO PORT ${port}`);
});
