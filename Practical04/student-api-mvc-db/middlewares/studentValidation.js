const Joi = require("joi");

const studentSchema = Joi.object({
    name: Joi.string().min(1).max(50).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 1 character long",
        "string.max": "Name cannot exceed 50 characters",
        "any.required": "Name is required",
    }),
    address: Joi.string().min(1).max(200).messages({
        "string.base": "Address must be a string",
        "string.min": "Address must be at least 1 character long",
        "string.max": "Address cannot exceed 200 characters",
    }),
});

function validateStudent(req, res, next) {
    const { error } = studentSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(", ");
        return res.status(400).send("Error: ", errorMessage);
    }

    next();
}

function validateStudentID(req, res, next) {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).send("Error: Invalid student ID, must be a positive number.");
    }

    next();
}

module.exports = {
    validateStudent,
    validateStudentID,
};
