const database = require("../database");

module.exports = class User {
	static findById(userId) {
		const query = "SELECT * FROM users WHERE user_id=$1";
		return database.query(query, [userId]);
	}

	static findByEmail(email) {
		const query = "SELECT * FROM users WHERE email=$1";
		return database.query(query, [email]);
	}

	static findByUserName(userName) {
		const query = "SELECT * FROM users WHERE user_name=$1";
		return database.query(query, [userName]);
	}

	static findByEmailOrUserName(emailOrUserName) {
		const query = "SELECT * FROM users WHERE email=$1 OR user_name=$1";
		return database.query(query, [emailOrUserName]);
	}

	static register(user) {
		const query = "INSERT INTO users (user_name ,email, password) VALUES ($1, $2, $3) RETURNING user_id";
		return database.query(query, [user.userName, user.email, user.password]);
	}

	static deleteUser(userId) {
		const query = "DELETE FROM users WHERE user_id=$1";
		return database.query(query, [userId]);
	}
};
