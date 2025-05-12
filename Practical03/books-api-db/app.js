const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get("", async (req, res) => {
    res.send("Books API server running");
});

app.get("/books", async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT id, title, author FROM Books`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        res.json(result.recordset);
    } catch (error) {
        console.error("Error in GET /books: ", error);
        res.status(500).send("Error retrieving books");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing database connection: ", error);
            }
        }
    }
});

app.get("/books/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send("Invalid book ID");
    }

    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT id, title, author FROM Books WHERE id = ${id}`;
        const request = connection.request();
        const result = await request.query(sqlQuery);
        if (!result.recordset[0]) {
            return res.status(404).send("Book not found");
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.log(`Error in GET /books/${id}: `, error);
        res.status(500).send("Error retrieving book");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing database connection: ", error);
            }
        }
    }
});

app.post("/books", async (req, res) => {
    const { title, author } = req.body;

    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;`;
        const request = connection.request();
        request.input("title", title);
        request.input("author", author);
        const result = await request.query(sqlQuery);

        const id = result.recordset[0].id;

        const getNewBookQuery = `SELECT id, title, author FROM Books WHERE id = @id`;
        const getNewBookRequest = connection.request();
        getNewBookRequest.input("id", id);
        const newBookResult = await getNewBookRequest.query(getNewBookQuery);

        res.status(201).json(newBookResult.recordset[0]);
    } catch (error) {
        console.log("Error in POST /books: ", error);
        res.status(500).send("Error creating book");
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log("Error closing database connection: ", error);
            }
        }
    }
});

app.listen(port, async () => {
    try {
        await sql.connect(dbConfig);
        console.log("CONNECTED TO DATABASE");
    } catch (error) {
        console.log("DATABASE CONNECTION ERROR:", error);
        process.exit(1);
    }

    console.log(`LISTENING TO PORT ${port}\n/////////////\n`);
});

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down :)");
    await sql.close();
    console.log("Database connection closed");
    process.exit();
});
