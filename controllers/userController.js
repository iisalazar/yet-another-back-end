const User = require("../models/User");

const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
	const { firstName = "", lastName = "", email = "", password = "" } = req.body;
	if (!firstName || !lastName || !email || !password) {
		res.status(400);
		res.json({
			msg: "All fields are required",
		});
		return;
	}

	const user = new User({
		firstName,
		lastName,
		email,
		password,
	});
	try {
		await user.save();
		return res.json({ success: true });
	} catch (err) {
		console.log(err);
		res.status(401);
		return res.json({ success: false, msg: "Unable to save user..." });
	}
};

exports.login = async (req, res) => {
	const { email = "", password = "" } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			console.log("User not found...");
			res.status(404);
			return res.json({ msg: "User not found... " });
		}
		// checks if password matches
		const isMatch = await user.comparePassword(password);
		console.log("isMatch?", isMatch);
		if (!isMatch) {
			console.log("wrong password");
			return res.json({ msg: "wrong password " });
		}

		const tokenPayload = { _id: user._id };

		const token = jwt.sign(tokenPayload, process.env.SECRET_KEY || "secret123");
		// remove the field "password"
		delete user.password;
		return res.json({
			success: true,
			token,
			user: user.toJSON(),
		});
	} catch (err) {
		if (err) throw err;
	}
};

exports.checkAuth = async (req, res) => {
	if (!req.cookies || !req.cookies.authToken) {
		return res.json({ isLoggedIn: false });
	}
	try {
		const payload = await jwt.verify(
			req.cookies.authToken,
			process.env.SECRET_KEY || "secret123"
		);
		const userId = payload._id;
		// check if user exists
		const user = await User.findById(userId);

		if (!user) throw new Error("User not found");

		return res.json({ isLoggedIn: false });
	} catch (err) {
		if (err) throw err;
		return res.json({ isLoggedIn: false });
	}
};


exports.list = async (req, res) => {
	const { email = "" } = req.query;
	let filter = {}
	if(email){
		filter = {
			email
		}
	}
	let users = await User.find(filter)
	if(users){
		users = users.map( user => user.toJSON() )
	}
	return res.json({
		success: true,
		msg: "Got all users",
		users
	})
}
