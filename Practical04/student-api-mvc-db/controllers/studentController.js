const studentModel = require("../models/studentModel");

async function getAllStudents(req, res) {
    try {
        const students = await studentModel.getAllStudents();
        return res.json(students);
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).send("Error retrieving students");
    }
}

async function getStudentByID(req, res) {
    try {
        const id = req.params.id;
        const student = await studentModel.getStudentByID(id);
        if (!student) return res.status(404).send("Student not found");

        return res.json(student);
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).send("Error retrieving student");
    }
}

async function createStudent(req, res) {
    try {
        const { name, address } = req.body;
        const student = await studentModel.createStudent(name, address);
        console.log(student);
        return res.status(201).json(student);
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).send("Error creating student");
    }
}

async function updateStudent(req, res) {
    try {
        const id = req.params.id;
        const { name, address } = req.body;
        const student = await studentModel.updateStudent(id, name, address);
        if (!student) return res.status(404).send("ID not found");
        return res.json(student);
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).send("Error updating student");
    }
}

async function deleteStudent(req, res) {
    try {
        const id = req.params.id;
        const status = await studentModel.deleteStudent(id);
        if (!status) return res.status(404).send("ID not found");
        return res.status(200).send("Student successfully deleted.");
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).send("Error updating student");
    }
}

module.exports = {
    getAllStudents,
    getStudentByID,
    createStudent,
    updateStudent,
    deleteStudent,
};
