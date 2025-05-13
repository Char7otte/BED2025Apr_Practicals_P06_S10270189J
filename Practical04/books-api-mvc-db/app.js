const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const bookController = require("./controllers/bookController");
const { validateBook, validateID } = require("./middlewares/bookValidation");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/books", bookController.getAllBooks);
app.get("/books/:id", validateID, bookController.getBookByID);
app.post("/books", validateBook, bookController.createBook);
app.put("/books/:id", validateID, validateBook, bookController.updateBook);
app.delete("/books/:id", validateID, bookController.deleteBook);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connections closed");
    process.exit();
});
