const sql = require("mssql");
const config = require("../dbConfig");

async function getAllStudents() {
    let connection;
    try {
        connection = await sql.connect(config);
        const query = `SELECT * From Students`;
        const request = connection.request();
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing connection:", error);
            }
        }
    }
}

async function getStudentByID(id) {
    let connection;
    try {
        connection = await sql.connect(config);
        const query = `SELECT * FROM Students WHERE student_id = @id`;
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(query);
        return result.recordset[0];
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing connection:", error);
            }
        }
    }
}

async function createStudent(name, address) {
    let connection;
    try {
        connection = await sql.connect(config);
        const query = `INSERT INTO Students (name, address) VALUES(@name, @address); SELECT SCOPE_IDENTITY() as student_id`;
        const request = connection.request();
        request.input("name", name);
        request.input("address", address);
        const result = await request.query(query);
        return await getStudentByID(result.recordset[0].student_id);
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing connection:", error);
            }
        }
    }
}

async function updateStudent(id, name, address) {
    let connection;
    try {
        connection = await sql.connect(config);
        const query = `UPDATE Students SET name = @name, address = @address WHERE student_id = @id`;
        const request = connection.request();
        request.input("id", id);
        request.input("name", name);
        request.input("address", address);
        await request.query(query);
        return await getStudentByID(id);
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing connection:", error);
            }
        }
    }
}

async function deleteStudent(id) {
    let connection;
    try {
        connection = await sql.connect(config);
        const query = `DELETE FROM Students WHERE student_id = @id`;
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(query);
        return result.rowsAffected != 0;
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error("Error closing connection:", error);
            }
        }
    }
}

module.exports = {
    getAllStudents,
    getStudentByID,
    createStudent,
    updateStudent,
    deleteStudent,
};
