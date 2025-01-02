const Joi = require('joi');

const companyValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        linkedinProfile: Joi.string().uri(),
        emails: Joi.array().items(Joi.string().email()).required(),
        phoneNumbers: Joi.array().items(Joi.string().pattern(/^\d{10}$/)).required(),
        comments: Joi.string().optional(),
        communicationPeriodicity: Joi.string().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: 'Validation error', error: error.details });
    }
    next();
};

module.exports = {
    companyValidation
};
