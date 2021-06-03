require("./db");
const faker = require("faker");
const User = require("./models/User");
const Post = require("./models/Post");

const seed = async () => {
	try {
		const users = await User.find();
		const user = users[Math.floor(Math.random() * users.length - 1)];
		console.log(user);
		if (!user) return;
		const post = {
			author: user._id,
			content: faker.lorem.paragraphs(3),
		};

		const new_post = new Post(post);
		await new_post.save();
		console.log(`Create post`);
		process.exit(0);
	} catch (err) {
		console.log(err);
	}
};

const createFakeUser = async () => {
	const user = new User({
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
	});

	await user.save();
	console.log("Created user...");
	process.exit(0);
};

// for (let i = 0; i < 10; i++) {
// 	createFakeUser();
// }

for (let j = 0; j < 5; j++) {
	seed();
}
// createFakeUser();
