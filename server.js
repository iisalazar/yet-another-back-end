const express = require("express");
const cookieParser = require("cookie-parser");

// connect to db
require("./db");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// middleware to allow CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Methods", "POST");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type"
	);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	next();
});

require("./routes")(app);

app.listen(3001, (err) => {
	if (err) {
		throw err;
		return;
	}
	console.log(`Listening at port 3001`);
});
