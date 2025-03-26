module.exports = (app) => {
  const sessions = require("../controllers/session.controller.js");
  const { verifyToken } = require("../middleware/auth.middleware.js");

  // All session routes require authentication
  app.use("/api/sessions", verifyToken);

  // Create a new Session
  app.post("/api/sessions", sessions.create);

  // Retrieve all Sessions for current user
  app.get("/api/sessions", sessions.findAll);

  // Get current user's active session
  app.get("/api/sessions/active", sessions.getActiveSession);

  // Retrieve a single Session with sessionId
  app.get("/api/sessions/:sessionId", sessions.findOne);

  // End a session
  app.put("/api/sessions/:sessionId/end", sessions.endSession);

  // Delete a Session with sessionId
  app.delete("/api/sessions/:sessionId", sessions.delete);
};
