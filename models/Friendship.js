const mongoose = require("mongoose");
const User = require("./User");

const friendshipSchema = mongoose.Schema(
	{
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		requestor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		status: {
			type: Number,
			enum: [
				0, // requested
				1, // pending
				2, // accepted
			],
		},
	},
	{
		timestamps: true,
	}
);

const Friends = mongoose.model("Friendship", friendshipSchema);
module.exports = Friends;
