const mongoose = require("mongoose");
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/EXER10";

mongoose.connect(
	url,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (err) {
			throw err;
			return;
		}
		console.log(`Successfully connected to db at ${url}`);
	}
);
