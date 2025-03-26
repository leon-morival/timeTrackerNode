module.exports = (app) => {
  const auth = require("../controllers/auth.controller.js");
  const { verifyToken } = require("../middleware/auth.middleware.js");

  // Create a new user
  app.post("/api/auth/signup", auth.signup);

  // Login user
  app.post("/api/auth/signin", auth.signin);

  // Get current user info
  app.get("/api/auth/me", verifyToken, auth.getCurrentUser);
};
