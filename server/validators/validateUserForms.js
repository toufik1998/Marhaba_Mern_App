const Joi = require('joi');

// Register Validation
function validateRegister(body){
    const registerSchema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        phone: Joi.number().min(6).required(),
        address: Joi.string().min(6).required(),
        // password: Joi.string().min(6).required(),
        password: Joi.string().min(6).required().valid(Joi.ref('password_confirmation')).messages({
            'any.only': 'password does not match'
        }),
        password_confirmation: Joi.string().min(6).required(),

        role: Joi.string().required(),
    });
    return registerSchema.validate(body);
}



function validateLogin(body){
    const loginSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return loginSchema.validate(body);
}

function validateEmail(body){
    const emailSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
    });
    return emailSchema.validate(body);
}

// validate password with confirm password
function validatePassword(body){
    const passwordSchema = Joi.object({
        // password should match confirm password
        password: Joi.string().min(6).required().valid(Joi.ref('password_confirmation')).messages({
            'any.only': 'password does not match'
        }),
        password_confirmation: Joi.string().min(6).required(),

    });
    return passwordSchema.validate(body);
}

module.exports.validateForms ={
    validateRegister,
    validateLogin,
    validateEmail,
    validatePassword
};