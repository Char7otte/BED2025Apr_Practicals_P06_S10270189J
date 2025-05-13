const joi = require("joi");

const bookSchema = joi.object({
    title: joi.string().min(1).max(50).required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "string.min": "Title must be at least 1 character long",
        "string.max": "Title cannot exceed 50 characters",
        "any.required": "Title is required",
    }),
    author: joi.string().min(1).max(50).required().messages({
        "string.base": "Author must be a string",
        "string.empty": "Author cannot be empty",
        "string.min": "Author must be at least 1 character long",
        "string.max": "Author cannot exceed 50 characters",
        "any.required": "Author is required",
    }),
});

function validateBook(req, res, next) {
    const { error } = bookSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(",");
        return res.status(400).send(errorMessage);
    }

    next();
}

function validateID(req, res, next) {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).send("Invalid ID. ID must be a positive number.");

    next();
}

module.exports = {
    validateBook,
    validateID,
};
