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
};
