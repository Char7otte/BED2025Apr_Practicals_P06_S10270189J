const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid"); //Generate unique ID when creating a new object
// const foods = require("./foods.json"); //Get current foods from JSON file
let foods = require("./foods.json");

app.use(express.json());

app.get("", async (req, res) => {
    return res.send("Hello World!");
});

app.get("/foods", async (req, res) => {
    const { name } = req.query;
    let searchResults = foods;

    if (searchResults.length == 0) {
        return res.status(400).json({ message: "No foods :(" });
    }
    if (name) {
        searchResults = foods.filter((food) => food.name.toLowerCase().includes(name.toLowerCase()));
        if (searchResults.length == 0) {
            return res.status(404).json({ message: `No foods found for query "${name}"` });
        }
    }

    return res.send(searchResults);
});

app.post("/foods", async (req, res) => {
    const { name, calories } = req.body;
    if (!name || (!calories && calories != 0)) {
        return res.status(400).json({ message: "Cannot create food: name and calories are required." });
    }

    const newFood = { id: uuidv4(), name, calories };
    foods.push(newFood);
    return res.status(201).json({ message: "Food created successfully.", food: newFood });
});

app.get("/foods/:id", async (req, res) => {
    const { id } = req.params;
    const foundFood = foods.find((food) => food.id == id);

    if (foundFood) {
        return res.send(foundFood);
    } else {
        return res.status(404).json({ message: `Food ID "${id}" not found.` });
    }
});

app.put("/foods/:id", async (req, res) => {
    const { id } = req.params;
    const { name, calories } = req.body;

    if (!name || (!calories && calories != 0)) {
        return res.status(400).json({ message: "Cannot update food: name and calories are required." });
    }

    const foundIndex = foods.findIndex((food) => food.id == id);
    if (foundIndex == -1) {
        return res.status(404).json({ message: `Food ID "${id}" not found.` });
    }

    foods[foundIndex] = { id: id, name, calories };
    return res.send(foods[foundIndex]);
});

app.delete("/foods/:id", (req, res) => {
    const id = req.params.id;
    const foundFood = foods.find((f) => f.id == id);

    if (!foundFood) {
        return res.status(404).json({ message: `No food with ID ${id} found.` });
    }

    foods = foods.filter((f) => f.id != id);
    return res.json({ message: `ID ${id} deleted successfully.` });
});

app.get("/*splat", (req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`LISTENING TO PORT ${port}`);
});
