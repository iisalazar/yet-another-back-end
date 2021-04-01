const Post = require("../models/Post");
const User = require("../models/User");

exports.list = async (req, res) => {
	const posts = await Post.find();
	res.json({
		posts,
	});
};

exports.create = async (req, res) => {
	const { author = null, content = "" } = req.body;
	if (!author || !content) {
		res.status(400);
		return res.json({
			success: false,
			msg: "Author and content fields are required",
		});
	}
	try {
		// check if user exists
		const user = await User.findById(author);
		if (!user) {
			res.status(404);
			return res.json({
				success: false,
				msg: `Error, can't find user with id ${author}`,
			});
		}

		const post = new Post({
			author,
			content,
		});

		await post.save();
		console.log("Successfully saved post!");
		return res.json({
			success: true,
			msg: "Post created successfully!",
			post,
		});
	} catch (err) {
		console.log(err);
		res.status(500);
		return res.json({
			success: false,
			msg: "Server error, please contact admin...",
		});
	}
};
