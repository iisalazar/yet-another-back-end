const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const Post = require("./Post");

const userSchema = mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	],

	friends: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Friendship",
		},
	],
});

userSchema.pre("save", function (next) {
	const user = this;
	if (!user.isModified("password")) return next();

	return bcrypt.genSalt((err, salt) => {
		if (err) return next(err);
		return bcrypt.hash(user.password, salt, (hashError, hash) => {
			if (hashError) return next(hashError);

			user.password = hash;
			return next();
		});
	});
});

userSchema.methods.comparePassword = function (password, callback) {
	return bcrypt.compare(password, this.password, callback);
};

userSchema.methods.toJSON = function () {
	let user = this.toObject();
	delete user.password;
	return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
