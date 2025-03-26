module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const { verifyToken } = require("../middleware/auth.middleware.js");

  // All user routes require authentication
  app.use("/api/users", verifyToken);

  // Create a new User
  app.post("/api/users", users.create);

  // Retrieve all Users
  app.get("/api/users", users.findAll);

  // Retrieve a single User with userId
  app.get("/api/users/:userId", users.findOne);

  // Update a User with userId
  app.put("/api/users/:userId", users.update);

  // Delete a User with userId
  app.delete("/api/users/:userId", users.delete);
};
