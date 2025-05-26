const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();

const studentController = require("./controllers/studentController");
const { validateStudent, validateStudentID } = require("./middlewares/studentValidation");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/students", studentController.getAllStudents);
app.get("/students/:id", validateStudentID, studentController.getStudentByID);
app.post("/students", validateStudent, studentController.createStudent);
app.put("/students/:id", validateStudentID, validateStudent, studentController.updateStudent);
app.delete("/students/:id", validateStudentID, studentController.deleteStudent);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connections closed");
    process.exit(0);
});
