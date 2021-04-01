const controllers = require("./controllers");
const authMiddleware = require('./middlewares/auth');

module.exports = (app) => {
	app.post("/users/signup", controllers.userController.signUp);
	app.post("/users/login", controllers.userController.login);
	app.get("/users/checkAuth", controllers.userController.checkAuth);

	// for post related requests
	app.get("/posts", controllers.postController.list);
	app.get("/posts/:id", controllers.postController.get);
	app.patch("/posts/:id", controllers.postController.update);
	app.delete("/posts/:id", controllers.postController.delete);
	app.post("/posts/create", controllers.postController.create);


	app.get('/protected', [ authMiddleware ], (req, res) => {
		res.send('Authenticated, cool');
	})
};
