const bookModel = require("../models/bookModel");

async function getAllBooks(req, res) {
    try {
        const books = await bookModel.getAllBooks();
        return res.json(books);
    } catch (error) {
        console.log("Controller error: ", error);
        return res.status(500).send("Error retrieving books");
    }
}

async function getBookByID(req, res) {
    try {
        const id = req.params.id;

        const book = await bookModel.getBookByID(id);
        if (!book) return res.status(404).send("Book not found");

        return res.json(book);
    } catch (error) {
        console.log("Controller error: ", error);
        return res.status(500).send("Error retrieving book");
    }
}

async function createBook(req, res) {
    try {
        const newBook = await bookModel.createBook(req.body);
        return res.status(201).json(newBook);
    } catch (error) {
        console.log("Controller error: ", error);
        return res.status(500).send("Error creating book");
    }
}

async function updateBook(req, res) {
    try {
        const updatedBook = await bookModel.updateBook(req.params.id, req.body);
        return res.json(updatedBook);
    } catch (error) {
        console.log("Controller error: ", error);
        return res.status(500).send("Error updating book");
    }
}

async function deleteBook(req, res) {
    try {
        const deleteIsSuccessful = await bookModel.deleteBook(req.params.id);
        if (!deleteIsSuccessful) return res.status(404).send("Book ID not found");

        return res.status(204).end();
    } catch (error) {
        console.log("Controller error: ", error);
        return res.status(500).send("Error deleting book");
    }
}

module.exports = {
    getAllBooks,
    getBookByID,
    createBook,
    updateBook,
    deleteBook,
};
