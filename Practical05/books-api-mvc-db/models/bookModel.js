const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllBooks() {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = `SELECT * FROM Books`;
        const result = await connection.request().query(query);
        return result.recordset;
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log("Error closing database connection: ", error);
            }
        }
    }
}

async function getBookByID(id) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = `SELECT * FROM Books WHERE id = @id`;
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(query);

        if (result.recordset.length == 0) {
            return null;
        }

        return result.recordset[0];
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log("Error closing database connection: ", error);
            }
        }
    }
}

async function createBook(data) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = `INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id`;
        const request = connection.request();
        request.input("title", data.title);
        request.input("author", data.author);
        const result = await request.query(query);

        const newID = result.recordset[0].id;
        return await getBookByID(newID);
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log("Error closing database connection: ", error);
            }
        }
    }
}

async function updateBook(id, { title, author }) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = `UPDATE Books SET title = @title, author = @author WHERE id = @id`;
        const request = connection.request();
        request.input("id", id);
        request.input("title", title);
        request.input("author", author);
        const result = await request.query(query);

        return await getBookByID(id);
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log("Error closing database connection: ", error);
            }
        }
    }
}

async function deleteBook(id) {
    let connection;
    try {
        connection = await sql.connect(dbConfig);
        const query = `DELETE FROM Books WHERE id = @id`;
        const request = connection.request();
        request.input("id", id);
        const result = await request.query(query);
        return result.rowsAffected != 0;
    } catch (error) {
        console.log("Database error: ", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log("Error closing database connection: ", error);
            }
        }
    }
}

module.exports = {
    getAllBooks,
    getBookByID,
    createBook,
    updateBook,
    deleteBook,
};
