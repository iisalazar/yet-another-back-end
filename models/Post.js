const mongoose = require("mongoose");
const User = require("./User");

const postSchema = mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		content: {
			type: String,
			required: true,
		},
	},
	// new form of adding timestamps
	// https://mongoosejs.com/docs/guide.html#timestamps
	{
		timestamps: true,
	}
);

postSchema.pre("save", async function (next) {
	const post = this;
	try {
		await User.updateOne({ _id: post.author }, { $push: { posts: post } });
		return next();
	} catch (err) {
		console.log(err);
		console.log(
			"Error saving, can't update user's post field. Please contact enginner / developer"
		);
	}
});

postSchema.pre("remove", async function (next) {
	const post = this;
	try {
		const author = await User.findById(post.author);
		author.posts.pull(post._id);
		return next();
	} catch (err) {
		console.log(err);
		console.log(
			"Error saving, can't update user's post field. Please contact enginner / developer"
		);
	}
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
