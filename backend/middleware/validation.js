const { validationResult } = require("express-validator");
const { body } = require("express-validator");
const User = require("../models/user");

function validate(req, res, next) {
	const validationErrors = validationResult(req);
	if (validationErrors.isEmpty()) {
		next();
	} else {
		res.status(400).json(validationErrors.errors[0].msg);
	}
}

function validateNameIsNotEmpty() {
	return body("name").isLength({ min: 1 }).withMessage("Name cannot be empty");
}

function validateUserNameDoesNotExist() {
	return body("user_name").custom(async (userName) => {
		const user = await User.findByUserName(userName);
		if (user.length > 0) {
			return Promise.reject("User name taken");
		}
	});
}

function validateEmailOnRegister() {
	return body("email")
		.isEmail()
		.withMessage("Email is invalid")
		.custom(async (email) => {
			const user = await User.findByEmail(email);
			if (user.length > 0) {
				return Promise.reject("Email address already exists");
			}
		})
		.normalizeEmail();
}

function validatePasswordOnRegister() {
	return body("password").isLength({ min: 5 }).withMessage("Password must be longer then 5 characters");
}

module.exports = {
	validate,
	validateNameIsNotEmpty,
	validateEmailOnRegister,
	validatePasswordOnRegister,
	validateUserNameDoesNotExist,
};
