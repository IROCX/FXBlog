function isValidUsername(username) {
	// Example: Username must be between 3 and 15 characters
	const regex = /^[a-zA-Z0-9_-]{3,15}$/;
	return regex.test(username);
}

function isValidName(name) {
	// Example: Name must contain only letters and spaces
	const regex = /^[a-zA-Z ]+$/;
	return regex.test(name);
}

function isValidContact(contact) {
	// Example: Contact must be a valid phone number
	const regex = /^[0-9]{10}$/;
	return regex.test(contact);
}

function isValidEmail(email) {
	// Example: Basic email format validation
	const regex = /\S+@\S+\.\S+/;
	return regex.test(email);
}

function isValidPassword(password) {
	// Example: Password must be at least 6 characters long
	return password.length >= 6;
}

function validateRegistrationInput(
	username,
	name,
	contact,
	email,
	password,
	cpassword
) {
	const errors = {};

	if (!isValidUsername(username)) {
		errors.username = 'Invalid username format';
	}

	if (!isValidName(name)) {
		errors.name = 'Invalid name format';
	}

	if (!isValidContact(contact)) {
		errors.contact = 'Invalid contact format';
	}

	if (!isValidEmail(email)) {
		errors.email = 'Invalid email format';
	}

	if (!isValidPassword(password)) {
		errors.password = 'Password must be at least 6 characters long';
	}

	if (password !== cpassword) {
		errors.cpassword = 'Passwords do not match';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
}

module.exports = {
	validateRegistrationInput,
};
