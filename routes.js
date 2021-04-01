const controllers = require("./controllers");

module.exports = (app) => {
	app.post("/users/signup", controllers.userController.signUp);
	app.post("/users/login", controllers.userController.login);
	app.get("/users/checkAuth", controllers.userController.checkAuth);

	// for post related requests
	app.get("/posts", controllers.postController.list);
	app.get("/posts/:id", controllers.postController.get);
	app.post("/posts/create", controllers.postController.create);
};
