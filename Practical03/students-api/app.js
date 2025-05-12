const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get("", async (req, res) => {
    return res.send("Running Student API");
});

app.get("/students", async (req, res) => {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Students`;
        const request = connection.request();
        const result = await request.query(sqlQuery);

        if (!result.recordset[0]) {
            return res.status(404).send("No students found. Please enter some entries.");
        }

        return res.json(result.recordset);
    } catch (error) {
        console.log("Error in GET /students: ", error);
        return res.status(500).send("Error retrieving students");
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

app.get("/students/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send("Invalid student ID");
    }

    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Students WHERE student_id = @id`;
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        if (!result.recordset[0]) {
            return res.status(404).send("Student not found");
        }

        return res.send(result.recordset[0]);
    } catch (error) {
        console.log("Error in GET /students/:id: ", error);
        return res.status(500).send("Error retrieving student");
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

app.post("/students", async (req, res) => {
    const newStudentData = req.body;

    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Students (name, address) VALUES(@name, @address); SELECT SCOPE_IDENTITY() AS id`;
        const request = connection.request();
        request.input("name", newStudentData.name);
        request.input("address", newStudentData.address);
        const result = await request.query(sqlQuery);

        const id = result.recordset[0].id;
        const newStudentQuery = `SELECT * FROM Students WHERE student_id = @id`;
        const newStudentRequest = connection.request();
        newStudentRequest.input("id", id);
        const newStudentResult = await newStudentRequest.query(newStudentQuery);

        return res.status(201).json(newStudentResult.recordset[0]);
    } catch (error) {
        console.log(`Error in POST /students${id}: `, error);
        return res.status(500).send("Error creating student");
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

app.put("/students/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send("Invalid student ID");
    }
    const { name, address } = req.body;

    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `
        UPDATE Students 
        SET name = @name, address = @address 
        WHERE student_id = @id; 

        SELECT * FROM Student WHERE student_id = @id`;
        const request = connection.request();
        request.input("id", id);
        request.input("name", name);
        request.input("address", address);
        const result = await request.query(sqlQuery);

        if (!result.recordset[0]) {
            return res.status(404).send("Student not found");
        }

        return res.json(result.recordset[0]);
    } catch (error) {
        console.log(`Error in PUT /students/${id}: `, error);
        return res.status(500).send("Error retrieving student");
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

app.delete("/students/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send("Invalid student ID");
    }

    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Students WHERE student_id = @id`;
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(sqlQuery);

        if (result.rowsAffected == 0) {
            return res.status(404).send("Student not found");
        }

        return res.status(204).end();
    } catch (error) {
        console.log(`Error in DELETE /students/${id}: `, error);
        return res.status(500).send("Error retrieving student");
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
        console.log("CONNECTED TO DB");
    } catch (error) {
        console.error("ERROR CONNECTING TO DB:", error);
        process.exit(1);
    }

    console.log(`Listening to port ${port}\n/////////\n`);
});

process.on("SIGINT", async () => {
    console.log("Graceful shutdown");
    await sql.close();
    console.log("DB connection severed");
    process.exit();
});

function checkID(string, errorMessage) {
    let value = parseInt(string);
    if (isNaN(value)) return res.status(400).send(errorMessage);
    return value;
}
