const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
	// if (!req.cookies || !req.cookies.authToken || !req.headers.authorization){
	console.log("Middleware running...");
	if (!req.cookies || !req.cookies.authToken) {
		res.status(403);
		return res.json({
			success: false,
			msg: "Unauthorized",
			isLoggedIn: false,
		});
	}

	console.log("Etits?");

	const authToken = req.cookies.authToken;

	if (authToken) {
		const token = authToken;
		try {
			// payload is id
			const payload = await jwt.verify(
				token,
				process.env.SECRET_KEY || "secret123"
			);
			const user = await User.findById(payload);
			if (!user) {
				res.status(404);
				return res.json({
					msg: `Error in middleware, can't find user with id ${payload}`,
					success: false,
				});
			}
			return next();
		} catch (err) {
			console.log(err);
			res.status(400);
			return res.json({
				success: false,
				msg: "Invalid token...",
			});
		}
	}
	res.status(403);
	return res.json({
		success: false,
		msg: "Auth token in cookies required",
	});
};
